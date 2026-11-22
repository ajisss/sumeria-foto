import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";

vi.mock("../server/email.js", () => ({
  sendResetPasswordEmail: async () => {},
  sendMail: async () => {},
  resetLink: (t: string) => t,
}));

const ORIGIN = "http://localhost:3000";
const PW = "correct-horse-battery";
let app: typeof import("../server/app.js").app;
let pool: import("pg").Pool;

type Jar = { cookie: string };
async function call(path: string, init: RequestInit & { jar?: Jar; json?: unknown; origin?: string | null } = {}) {
  const headers = new Headers(init.headers);
  if (init.origin !== null) headers.set("origin", init.origin ?? ORIGIN);
  if (init.jar?.cookie) headers.set("cookie", init.jar.cookie);
  let body = init.body;
  if (init.json !== undefined) {
    headers.set("content-type", "application/json");
    body = JSON.stringify(init.json);
  }
  const res = await app.request(path, { ...init, headers, body });
  const sc = res.headers.getSetCookie?.() ?? [];
  if (init.jar && sc.length) init.jar.cookie = sc.map((c) => c.split(";")[0]).join("; ");
  const text = await res.text();
  let data: any = null;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}
let ipSeq = 0;
async function login(email: string) {
  const jar: Jar = { cookie: "" };
  await call("/api/auth/sign-in/email", { method: "POST", json: { email, password: PW }, jar, headers: { "x-forwarded-for": `10.7.0.${(ipSeq++ % 250) + 1}` } });
  return jar;
}
async function seedUser(email: string, role: string) {
  const { auth } = await import("../server/auth.js");
  const ctx = await auth().$context;
  const u = await ctx.internalAdapter.createUser({ email, name: email.split("@")[0]!, role, banned: false, emailVerified: true }, { method: "admin" });
  await ctx.internalAdapter.createAccount({ userId: u.id, providerId: "credential", accountId: u.id, password: await ctx.password.hash(PW) });
}

beforeAll(async () => {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL ?? "postgres://postgres@localhost:54329/payhub";
  process.env.BETTER_AUTH_SECRET = "z".repeat(40);
  process.env.APP_URL = ORIGIN;
  delete process.env.RESEND_API_KEY;
  const { getPool } = await import("../server/db/client.js");
  pool = getPool();
  await pool.query("drop schema if exists drizzle cascade; drop schema public cascade; create schema public;");
  await (await import("drizzle-orm/node-postgres/migrator")).migrate((await import("../server/db/client.js")).db(), { migrationsFolder: "drizzle" });
  app = (await import("../server/app.js")).app;
  for (const [e, r] of [["owner", "owner"], ["admin", "admin"], ["staff", "staff"], ["viewer", "viewer"]] as const) await seedUser(`${e}@t.test`, r);
  // Invoice: Maret 2026 terbayar 2.000.000 (paidDate 10 Mar) + 1.000.000 belum; Feb terbayar 500.000
  const owner = await login("owner@t.test");
  const inv = (id: string, date: string, pays: { amount: number; paid: boolean; paidDate?: string }[]) => ({
    id, date, customerSnap: { name: "X" }, items: [{ packageItem: "P", qty: 1, unitPrice: pays.reduce((s, p) => s + p.amount, 0), discount: 0 }], payments: pays,
  });
  const changes = [
    inv("t-i1", "2026-03-01", [{ amount: 2_000_000, paid: true, paidDate: "2026-03-10" }, { amount: 1_000_000, paid: false }]),
    inv("t-i2", "2026-02-01", [{ amount: 500_000, paid: true, paidDate: "2026-02-20" }]),
  ].map((d) => ({ op: "upsert", id: d.id, version: 0, data: d }));
  expect((await call("/api/data/invoices/sync", { method: "POST", jar: owner, json: { changes } })).status).toBe(200);
});
afterAll(async () => { await pool?.end(); });

describe("target omset bulanan", () => {
  it("semua endpoint butuh login", async () => {
    for (const [m, p] of [["GET", "/api/targets"], ["GET", "/api/targets/progress"], ["PUT", "/api/targets/2026-03"], ["DELETE", "/api/targets/2026-03"]] as const) {
      expect((await call(p, { method: m, json: m === "PUT" ? { amount: 1 } : undefined })).status, `${m} ${p}`).toBe(401);
    }
  });

  it("hanya owner yang boleh membuat/ubah/hapus/list target", async () => {
    for (const e of ["admin", "staff", "viewer"]) {
      const jar = await login(`${e}@t.test`);
      expect((await call("/api/targets/2026-03", { method: "PUT", jar, json: { amount: 10_000_000 } })).status, `${e} put`).toBe(403);
      expect((await call("/api/targets/2026-03", { method: "DELETE", jar })).status, `${e} delete`).toBe(403);
      expect((await call("/api/targets?year=2026", { jar })).status, `${e} list`).toBe(403);
    }
    expect((await pool.query("select count(*)::int c from monthly_targets")).rows[0].c).toBe(0);
  });

  it("owner membuat target, menimpa, melihat realisasi & persen", async () => {
    const jar = await login("owner@t.test");
    expect((await call("/api/targets/2026-03", { method: "PUT", jar, json: { amount: 10_000_000 } })).status).toBe(200);
    expect((await call("/api/targets/2026-02", { method: "PUT", jar, json: { amount: 5_000_000 } })).status).toBe(200);
    expect((await call("/api/targets/2026-02", { method: "PUT", jar, json: { amount: 2_000_000 } })).status).toBe(200); // timpa
    const list = await call("/api/targets?year=2026", { jar });
    expect(list.status).toBe(200);
    expect(list.data.months).toHaveLength(12);
    const mar = list.data.months.find((m: any) => m.month === "2026-03");
    expect(mar).toMatchObject({ target: 10_000_000, revenue: 2_000_000, percent: 20 });
    expect(list.data.months.find((m: any) => m.month === "2026-02")).toMatchObject({ target: 2_000_000, revenue: 500_000, percent: 25 });
    expect(list.data.months.find((m: any) => m.month === "2026-04")).toMatchObject({ target: null, revenue: 0, percent: null });
    const p = await call("/api/targets/progress?month=2026-03", { jar });
    expect(p.data).toEqual({ month: "2026-03", target: 10_000_000, revenue: 2_000_000, percent: 20 });
  });

  it("admin hanya menerima persen: tanpa nominal target maupun omset", async () => {
    const jar = await login("admin@t.test");
    const p = await call("/api/targets/progress?month=2026-03", { jar });
    expect(p.status).toBe(200);
    expect(p.data).toEqual({ month: "2026-03", percent: 20 });
    expect(JSON.stringify(p.data)).not.toMatch(/target|revenue|10000000|2000000/);
    // bulan tanpa target: persen null, tidak membocorkan apa pun
    expect((await call("/api/targets/progress?month=2026-04", { jar })).data).toEqual({ month: "2026-04", percent: null });
  });

  it("role dengan analytics:finance (viewer) melihat nominal", async () => {
    const jar = await login("viewer@t.test");
    expect((await call("/api/targets/progress?month=2026-03", { jar })).data).toMatchObject({ target: 10_000_000, revenue: 2_000_000, percent: 20 });
  });

  it("persen bisa lebih dari 100 bila melampaui target", async () => {
    const owner = await login("owner@t.test");
    await call("/api/targets/2026-03", { method: "PUT", jar: owner, json: { amount: 1_000_000 } });
    expect((await call("/api/targets/progress?month=2026-03", { jar: owner })).data.percent).toBe(200);
  });

  it("validasi input ditolak", async () => {
    const jar = await login("owner@t.test");
    for (const m of ["2026-13", "2026-00", "26-03", "2026-3", "abc", "2026-03-01"]) {
      expect((await call(`/api/targets/${m}`, { method: "PUT", jar, json: { amount: 1000 } })).status, m).toBe(400);
      expect((await call(`/api/targets/progress?month=${m}`, { jar })).status, "progress " + m).toBe(400);
    }
    for (const body of [{ amount: 0 }, { amount: -5 }, { amount: 1.5 }, { amount: "100" }, { amount: 1e14 }, {}, null, { amount: null }]) {
      expect((await call("/api/targets/2026-05", { method: "PUT", jar, json: body })).status, JSON.stringify(body)).toBe(400);
    }
    expect((await call("/api/targets?year=abcd", { jar })).status).toBe(400);
    expect((await pool.query("select count(*)::int c from monthly_targets where month='2026-05'")).rows[0].c).toBe(0);
  });

  it("origin asing ditolak (CSRF) dan hapus target jalan untuk owner", async () => {
    const jar = await login("owner@t.test");
    expect((await call("/api/targets/2026-06", { method: "PUT", jar, json: { amount: 1000 }, origin: "https://evil.example" })).status).toBe(403);
    expect((await call("/api/targets/2026-02", { method: "DELETE", jar, origin: "https://evil.example" })).status).toBe(403);
    expect((await call("/api/targets/2026-02", { method: "DELETE", jar })).status).toBe(200);
    expect((await call("/api/targets/progress?month=2026-02", { jar })).data.target).toBeNull();
  });
});
