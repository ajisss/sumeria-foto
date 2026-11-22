import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { audit } from "../audit.js";
import { db, schema } from "../db/client.js";
import { requirePermission, requireUser, type AppEnv } from "../middleware.js";
import { can } from "../rbac.js";
import { metrics, type Rec } from "./analytics.js";

/**
 * Target omset bulanan. Realisasi = revenue yang sama dengan Analytics (pembayaran invoice yang paid,
 * dihitung pada paidDate, fallback tanggal invoice).
 * - Owner (targets:manage) membuat/ubah/hapus target dan melihat nominal.
 * - Role dengan analytics:finance melihat target + realisasi + persen.
 * - Role lain (mis. Admin) HANYA mendapat persen pencapaian, tanpa nominal target maupun omset.
 */

const monthRe = /^\d{4}-(0[1-9]|1[0-2])$/;
const month = z.string().regex(monthRe, "Format bulan harus YYYY-MM");
const amountBody = z.object({ amount: z.number().int().min(1).max(1e13) });

function rangeOf(m: string) {
  const [y, mo] = m.split("-").map(Number) as [number, number];
  const last = new Date(Date.UTC(y, mo, 0)).getUTCDate();
  return { start: `${m}-01`, end: `${m}-${String(last).padStart(2, "0")}` };
}
const percentOf = (revenue: number, target: number | null) => (target && target > 0 ? Math.round((revenue / target) * 1000) / 10 : null);

async function loadInvoices(): Promise<Rec[]> {
  const R = schema.records;
  return (await db().select({ data: R.data }).from(R).where(eq(R.collection, "invoices"))).map((r) => r.data as Rec);
}
async function targetsMap(): Promise<Map<string, number>> {
  const rows = await db().select().from(schema.monthlyTargets);
  return new Map(rows.map((r) => [r.month, Number(r.amount)]));
}

export const targetRoutes = new Hono<AppEnv>();
targetRoutes.use("*", requireUser);

// Widget Analytics. Role tanpa akses finance hanya menerima persen.
targetRoutes.get("/progress", async (c) => {
  const role = c.get("user").role;
  if (!can(role, "read:invoices")) throw new HTTPException(403, { message: "Tidak punya akses" });
  const q = month.safeParse(c.req.query("month") ?? new Date().toISOString().slice(0, 7));
  if (!q.success) throw new HTTPException(400, { message: "Parameter tidak valid" });
  const target = (await targetsMap()).get(q.data) ?? null;
  const revenue = target === null ? 0 : metrics(await loadInvoices(), null, rangeOf(q.data)).revenue;
  const percent = percentOf(revenue, target);
  c.header("Cache-Control", "no-store");
  if (can(role, "analytics:finance")) return c.json({ month: q.data, target, revenue, percent });
  return c.json({ month: q.data, percent });
});

// Halaman Target (owner): 12 bulan dalam satu tahun beserta realisasi.
targetRoutes.get("/", requirePermission("targets:manage"), async (c) => {
  const y = z.string().regex(/^\d{4}$/).safeParse(c.req.query("year") ?? String(new Date().getUTCFullYear()));
  if (!y.success) throw new HTTPException(400, { message: "Parameter tidak valid" });
  const [targets, invoices] = await Promise.all([targetsMap(), loadInvoices()]);
  const months = Array.from({ length: 12 }, (_, i) => {
    const m = `${y.data}-${String(i + 1).padStart(2, "0")}`;
    const target = targets.get(m) ?? null;
    const revenue = metrics(invoices, null, rangeOf(m)).revenue;
    return { month: m, target, revenue, percent: percentOf(revenue, target) };
  });
  c.header("Cache-Control", "no-store");
  return c.json({ year: Number(y.data), months });
});

targetRoutes.put("/:month", requirePermission("targets:manage"), async (c) => {
  const m = month.safeParse(c.req.param("month"));
  if (!m.success) throw new HTTPException(400, { message: "Format bulan harus YYYY-MM" });
  const body = amountBody.safeParse(await c.req.json().catch(() => null));
  if (!body.success) throw new HTTPException(400, { message: "Target harus berupa angka rupiah lebih dari 0" });
  const actor = c.get("user");
  await db()
    .insert(schema.monthlyTargets)
    .values({ month: m.data, amount: body.data.amount, updatedBy: actor.id })
    .onConflictDoUpdate({ target: schema.monthlyTargets.month, set: { amount: body.data.amount, updatedBy: actor.id, updatedAt: new Date() } });
  await audit(actor.id, "target.set", m.data, { amount: body.data.amount });
  return c.json({ month: m.data, amount: body.data.amount });
});

targetRoutes.delete("/:month", requirePermission("targets:manage"), async (c) => {
  const m = month.safeParse(c.req.param("month"));
  if (!m.success) throw new HTTPException(400, { message: "Format bulan harus YYYY-MM" });
  await db().delete(schema.monthlyTargets).where(eq(schema.monthlyTargets.month, m.data));
  await audit(c.get("user").id, "target.delete", m.data);
  return c.json({ ok: true });
});
