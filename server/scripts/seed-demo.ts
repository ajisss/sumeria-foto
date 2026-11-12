/**
 * Data dummy untuk development: customer, invoice, dan expense (Jan - Nov 2026) supaya halaman
 * Analytics ada isinya. Semua id berawalan "demo-", jadi aman dibersihkan tanpa menyentuh data asli.
 *
 *   npm run seed:demo            # hapus data demo lama lalu isi ulang
 *   npm run seed:demo -- --clean # hanya hapus data demo
 *
 * Menolak jalan ke database non-lokal (kecuali --force) supaya tidak mengotori production.
 */
import { and, eq, like } from "drizzle-orm";
import { db, getPool, schema } from "../db/client.js";

const url = process.env.DATABASE_URL ?? "";
if (!/localhost|127\.0\.0\.1/.test(url) && !process.argv.includes("--force")) {
  throw new Error("DATABASE_URL bukan database lokal. Seed demo dibatalkan (pakai --force bila memang disengaja).");
}

const R = schema.records;

// PRNG deterministik: hasil seed selalu sama.
let seed = 20261111;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = <T>(a: readonly T[]) => a[Math.floor(rnd() * a.length)]!;
const between = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1));
const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
const addDays = (s: string, n: number) => {
  const t = new Date(s + "T00:00:00Z");
  t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
};

const TODAY = new Date().toISOString().slice(0, 10);
const YEAR = Number(TODAY.slice(0, 4));

const PLAN_STAGES: Record<string, string[]> = {
  "2x": ["Down Payment", "Paid Full"],
  "3x": ["Down Payment", "Second Payment", "Paid Full"],
};
const PLAN_PERCENTS: Record<string, number[]> = { "2x": [30, 70], "3x": [30, 35, 35] };

// [nama item di paket, harga satuan]
const PACKAGE: readonly (readonly [string, number])[] = [
  ["Photographer Half Day", 2_500_000],
  ["Photographer Full Day", 4_500_000],
  ["Videographer Half Day", 3_000_000],
  ["Videographer Full Day", 5_500_000],
  ["Drone", 1_500_000],
  ["Same Day Edit", 2_000_000],
  ["Album 20x30 cm (22 Pages)", 1_800_000],
  ["Full Documentation 2 Hours (2 Crew)", 6_500_000],
  ["Highlight Video 3 Minutes", 2_500_000],
  ["Mini Studio up to 6x6 Meter", 2_200_000],
];

const CUSTOMERS = [
  ["Budi & Sari", "Female", "Jakarta"], ["PT Maju Jaya", "Male", "Bandung"], ["Andi & Rina", "Female", "Surabaya"],
  ["CV Kreasi Visual", "Male", "Jakarta"], ["Dewi & Rama", "Female", "Yogyakarta"], ["Hotel Cempaka", "Male", "Bali"],
  ["Lina & Fajar", "Female", "Bekasi"], ["Studio Nusantara", "Male", "Depok"], ["Maya & Eko", "Female", "Tangerang"],
  ["Yayasan Harapan", "Male", "Bogor"],
] as const;

async function clean() {
  for (const c of ["customers", "invoices", "expenses"]) {
    await db().delete(R).where(and(eq(R.collection, c), like(R.id, "demo-%")));
  }
}

async function main() {
  await clean();
  if (process.argv.includes("--clean")) {
    console.log("Data demo dihapus.");
    return;
  }

  const owner = await db().query.user.findFirst({ where: eq(schema.user.role, "owner") });
  const by = owner?.id ?? null;
  const insert = async (collection: string, recs: { id: string }[]) => {
    for (const r of recs) {
      await db().insert(R).values({ collection, id: r.id, data: r, version: 1, createdBy: by, updatedBy: by });
    }
  };

  const customers = CUSTOMERS.map(([name, gender, city], i) => ({
    id: `demo-c${i + 1}`,
    name,
    gender,
    city,
    email: `${name.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "")}@example.com`,
    phone: `0812${between(10000000, 99999999)}`,
  }));

  const invoices: any[] = [];
  const nowMonth = Number(TODAY.slice(5, 7));
  let seq = 0;
  // Tahun lalu (Jun-Des) ikut dibuat supaya perbandingan "vs periode sebelumnya" di Analytics ada isinya.
  const periods = [
    { y: YEAR - 1, from: 6, to: 12, ref: 12 + nowMonth },
    { y: YEAR, from: 1, to: nowMonth, ref: nowMonth },
  ];
  for (const per of periods)
  for (let m = per.from; m <= per.to; m++) {
    const count = between(2, 4);
    for (let k = 0; k < count; k++) {
      seq++;
      const day = Math.min(between(2, 27), per.y === YEAR && m === nowMonth ? Number(TODAY.slice(8, 10)) : 28);
      const date = ymd(per.y, m, day);
      const cust = pick(customers);
      const plan = rnd() < 0.7 ? "2x" : "3x";
      const eventDate = addDays(date, between(10, 60));
      const items = Array.from({ length: between(1, 3) }, (_, j) => {
        const [name, price] = PACKAGE[(seq * 3 + j * 2 + between(0, 4)) % PACKAGE.length]!;
        return { id: `demo-it${seq}-${j}`, eventDate, packageItem: name, description: name, qty: name.startsWith("Drone") || name.startsWith("Same") ? 1 : between(1, 2), unitPrice: price, discount: rnd() < 0.25 ? 250_000 : 0 };
      });
      const total = items.reduce((s, i) => s + Math.max(0, i.qty * i.unitPrice - i.discount), 0);
      const pcts = PLAN_PERCENTS[plan]!;
      const amounts = pcts.map((p) => Math.round((total * p) / 100));
      amounts[amounts.length - 1]! += total - amounts.reduce((s, a) => s + a, 0);

      // Invoice lama biasanya lunas; yang baru lebih sering baru DP / belum bayar.
      const age = (per.ref - m) * 30 - day;
      const r = rnd();
      const paidCount = age > 45 ? pcts.length : age > 20 ? (r < 0.5 ? pcts.length : r < 0.85 ? 1 : 0) : r < 0.2 ? pcts.length : r < 0.65 ? 1 : 0;
      const payments = pcts.map((p, n) => {
        const paid = n < paidCount;
        const due = addDays(date, n === 0 ? 3 : Math.round(((eventDate > date ? 1 : 0) * n * 20) + 7));
        return { id: `demo-p${seq}-${n}`, label: PLAN_STAGES[plan]![n], percent: p, amount: amounts[n], paid, paidDate: paid ? (addDays(due, between(-2, 4)) > TODAY ? TODAY : addDays(due, between(-2, 4))) : null };
      });
      invoices.push({
        id: `demo-i${seq}`,
        invNumber: `INV/${String(seq).padStart(3, "0")}/${per.y}`,
        date,
        customerId: cust.id,
        customerSnap: { name: cust.name, address: cust.city, phone: cust.phone, email: cust.email },
        items,
        paymentPlan: plan,
        payments,
        notes: "",
        lastUpdated: date,
      });
    }
  }

  // Satu-dua invoice dengan acara sangat dekat & belum lunas supaya banner "telat bayar (H-7)" terlihat.
  for (const inv of invoices.slice(-3)) {
    if (inv.payments.some((p: any) => !p.paid)) for (const it of inv.items) it.eventDate = addDays(TODAY, between(2, 6));
  }

  const expenses: any[] = [];
  const exp = (category: string, itemName: string, date: string, qty: number, unitPrice: number, invoiceId = "") =>
    expenses.push({ id: `demo-e${expenses.length + 1}`, date, category, itemName, qty, unitPrice, invoiceId });
  for (const per of periods)
  for (let m = per.from; m <= per.to; m++) {
    const last = per.y === YEAR && m === nowMonth ? Number(TODAY.slice(8, 10)) : 28;
    exp("Salary", "Monthly Salary", ymd(per.y, m, Math.min(25, last)), 1, 6_000_000);
    exp("Marketing", pick(["Meta Ads", "Google Ads", "TikTok Ads", "Endorsement", "KOL / Influencer"]), ymd(per.y, m, Math.min(between(3, 20), last)), 1, between(8, 30) * 100_000);
    for (const inv of invoices.filter((i) => i.date.startsWith(String(per.y)) && Number(i.date.slice(5, 7)) === m)) {
      exp("Project", pick(["Photographer Half Day", "Videographer Half Day", "Studio Partner", "Drone"]), addDays(inv.date, between(1, 5)) > TODAY ? TODAY : addDays(inv.date, between(1, 5)), 1, between(8, 25) * 100_000, inv.id);
    }
    if (m === 3 || m === 8) exp("Asset", pick(["Lensa 35mm", "Gimbal", "Laptop Editing"]), ymd(per.y, m, 10), 1, between(35, 120) * 100_000);
    if (m % 4 === 0) exp("Other", "Others", ymd(per.y, m, Math.min(14, last)), 1, between(3, 9) * 100_000);
  }

  await insert("customers", customers);
  await insert("invoices", invoices);
  await insert("expenses", expenses);
  console.log(`Data demo dibuat: ${customers.length} customer, ${invoices.length} invoice, ${expenses.length} expense.`);
}

try {
  await main();
} finally {
  await getPool().end();
}
