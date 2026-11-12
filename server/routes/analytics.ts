import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { db, schema } from "../db/client.js";
import { requireUser, type AppEnv } from "../middleware.js";
import { can } from "../rbac.js";

/**
 * Agregasi untuk halaman Analytics. Definisi angka (sama dengan Master Dashboard di frontend):
 * - revenue      = pembayaran invoice yang paid, dihitung pada paidDate (fallback tanggal invoice)
 * - expenses     = semua expense (qty * unitPrice - discount), termasuk kategori Asset
 * - invoiced     = nilai item invoice yang tanggalnya jatuh di rentang
 * - outstanding  = invoiced - pembayaran paid dari invoice-invoice itu
 * Expense hanya dihitung bila role punya `read:expenses`; kalau tidak, field-nya null.
 */

type Rec = Record<string, unknown>;
type Payment = { amount?: unknown; paid?: unknown; paidDate?: unknown; dueDate?: unknown };
type Item = { packageItem?: unknown; qty?: unknown; unitPrice?: unknown; discount?: unknown; eventDate?: unknown };

const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const query = z.object({
  start: ymd.optional(),
  end: ymd.optional(),
  today: ymd.optional(),
  customer: z.string().max(200).optional(),
});

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : Number(v) || 0);
const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

const lineTotal = (o: Item) => Math.max(0, num(o.qty) * num(o.unitPrice) - num(o.discount));
const docSubtotal = (items: Item[]) => items.reduce((s, i) => s + lineTotal(i), 0);
const paidPayments = (inv: Rec) => arr<Payment>(inv.payments).filter((p) => p.paid);
const paidSum = (inv: Rec) => paidPayments(inv).reduce((s, p) => s + num(p.amount), 0);
const fullyPaid = (inv: Rec) => {
  const p = arr<Payment>(inv.payments);
  return p.length > 0 && !!p[p.length - 1]!.paid;
};

function addDays(d: string, n: number) {
  const t = new Date(d + "T00:00:00Z");
  t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
}
// Jatuh tempo tiap termin. Aturan default HARUS sama dengan defaultDueDates() di public/app.js:
// termin pertama = tanggal invoice + 7, terakhir = event pertama - 7 (atau invoice + 30 tanpa event), sisanya dibagi rata.
function defaultDueDates(n: number, invDate: string, events: string[]) {
  const ev = [...events].sort()[0];
  const base = invDate || new Date().toISOString().slice(0, 10);
  const last = ev ? addDays(ev, -7) : addDays(base, 30);
  const first = addDays(base, 7) < last ? addDays(base, 7) : last;
  const span = Math.round((Date.parse(last + "T00:00:00Z") - Date.parse(first + "T00:00:00Z")) / 864e5);
  return Array.from({ length: n }, (_, i) => (i === n - 1 ? last : addDays(first, Math.round((span * i) / Math.max(n - 1, 1)))));
}
function hasOverdue(inv: Rec, today: string) {
  const ps = arr<Payment>(inv.payments);
  if (ps.length === 0 || fullyPaid(inv)) return false;
  const events = arr<Item>(inv.items).map((it) => str(it.eventDate)).filter(Boolean);
  const defs = defaultDueDates(ps.length, str(inv.date), events);
  return ps.some((p, i) => !p.paid && (str(p.dueDate) || defs[i]!) !== "" && today > (str(p.dueDate) || defs[i]!));
}
const spanDays = (a: string, b: string) => Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 864e5) + 1;
const monthOf = (d: string) => d.slice(0, 7);

function monthKeys(start: string, end: string) {
  const keys: string[] = [];
  let y = Number(start.slice(0, 4));
  let m = Number(start.slice(5, 7));
  const ey = Number(end.slice(0, 4));
  const em = Number(end.slice(5, 7));
  while (y < ey || (y === ey && m <= em)) {
    keys.push(`${y}-${String(m).padStart(2, "0")}`);
    if (++m > 12) {
      m = 1;
      y++;
    }
  }
  return keys.slice(-12);
}

type Range = { start: string; end: string };

function metrics(invs: Rec[], exps: Rec[] | null, r: Range) {
  const inR = (d: string) => !!d && d >= r.start && d <= r.end;
  let revenue = 0;
  let invoiced = 0;
  let paidOfInvoiced = 0;
  for (const i of invs) {
    const date = str(i.date);
    for (const p of paidPayments(i)) if (inR(str(p.paidDate) || date)) revenue += num(p.amount);
    if (inR(date)) {
      invoiced += docSubtotal(arr<Item>(i.items));
      paidOfInvoiced += paidSum(i);
    }
  }
  const expenses = exps ? exps.filter((e) => inR(str(e.date))).reduce((s, e) => s + lineTotal(e as Item), 0) : null;
  return {
    revenue,
    expenses,
    profit: expenses === null ? null : revenue - expenses,
    invoiced,
    paidOfInvoiced,
    outstanding: Math.max(0, invoiced - paidOfInvoiced),
  };
}

export const analyticsRoutes = new Hono<AppEnv>();
analyticsRoutes.use("*", requireUser);

analyticsRoutes.get("/", async (c) => {
  const role = c.get("user").role;
  if (!can(role, "read:invoices")) throw new HTTPException(403, { message: "Tidak punya akses" });
  const q = query.safeParse(c.req.query());
  if (!q.success) throw new HTTPException(400, { message: "Parameter tidak valid" });
  const canExpenses = can(role, "read:expenses");

  const R = schema.records;
  const load = async (collection: string) =>
    (await db().select({ data: R.data }).from(R).where(eq(R.collection, collection))).map((r) => r.data as Rec);
  const [allInvoices, expenseRows] = await Promise.all([load("invoices"), canExpenses ? load("expenses") : Promise.resolve(null)]);

  const today = q.data.today ?? new Date().toISOString().slice(0, 10);
  const customers = [...new Set(allInvoices.map((i) => str((i.customerSnap as Rec | undefined)?.name)).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const customer = q.data.customer || "";
  const invs = allInvoices.filter((i) => !customer || str((i.customerSnap as Rec | undefined)?.name) === customer);

  // "Semua waktu": start tidak dikirim -> tanggal paling awal di data.
  const dates: string[] = [];
  for (const i of invs) {
    if (str(i.date)) dates.push(str(i.date));
    for (const p of paidPayments(i)) if (str(p.paidDate) || str(i.date)) dates.push(str(p.paidDate) || str(i.date));
  }
  for (const e of expenseRows ?? []) if (str(e.date)) dates.push(str(e.date));
  dates.sort();
  const end = q.data.end ?? today;
  const start = q.data.start ?? dates[0] ?? `${today.slice(0, 4)}-01-01`;
  const range: Range = start <= end ? { start, end } : { start: end, end: start };
  const prev: Range | null = q.data.start
    ? (() => {
        const pe = addDays(range.start, -1);
        return { start: addDays(pe, -(spanDays(range.start, range.end) - 1)), end: pe };
      })()
    : null;

  const inR = (d: string) => !!d && d >= range.start && d <= range.end;
  const rangeInvs = invs.filter((i) => inR(str(i.date)));

  let paid = 0;
  let partial = 0;
  let unpaid = 0;
  let overdue = 0;
  for (const i of rangeInvs) {
    if (fullyPaid(i)) paid++;
    else {
      if (paidPayments(i).length) partial++;
      else unpaid++;
      if (hasOverdue(i, today)) overdue++;
    }
  }

  const byMonth = new Map(monthKeys(range.start, range.end).map((k) => [k, { revenue: 0, expense: 0 }]));
  for (const i of invs)
    for (const p of paidPayments(i)) {
      const d = str(p.paidDate) || str(i.date);
      if (inR(d)) {
        const m = byMonth.get(monthOf(d));
        if (m) m.revenue += num(p.amount);
      }
    }
  for (const e of expenseRows ?? []) {
    const d = str(e.date);
    if (inR(d)) {
      const m = byMonth.get(monthOf(d));
      if (m) m.expense += lineTotal(e as Item);
    }
  }

  const cust = new Map<string, { name: string; paid: number; invoiced: number; count: number }>();
  const items = new Map<string, { name: string; revenue: number; qty: number }>();
  for (const i of rangeInvs) {
    const name = str((i.customerSnap as Rec | undefined)?.name) || "";
    const row = cust.get(name) ?? { name, paid: 0, invoiced: 0, count: 0 };
    row.paid += paidSum(i);
    row.invoiced += docSubtotal(arr<Item>(i.items));
    row.count++;
    cust.set(name, row);
    for (const it of arr<Item>(i.items)) {
      const k = str(it.packageItem);
      const r = items.get(k) ?? { name: k, revenue: 0, qty: 0 };
      r.revenue += lineTotal(it);
      r.qty += num(it.qty);
      items.set(k, r);
    }
  }

  c.header("Cache-Control", "no-store");
  return c.json({
    range,
    prev,
    canExpenses,
    customers,
    current: metrics(invs, expenseRows, range),
    previous: prev ? metrics(invs, expenseRows, prev) : null,
    status: { total: rangeInvs.length, paid, partial, unpaid, overdue },
    months: [...byMonth].map(([key, v]) => ({ key, revenue: v.revenue, expense: canExpenses ? v.expense : null })),
    topCustomers: [...cust.values()].sort((a, b) => b.paid - a.paid || b.invoiced - a.invoiced).slice(0, 4),
    topItems: [...items.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 4),
  });
});
