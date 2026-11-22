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
  return { status: res.status, data, res };
}
let ipSeq = 0;
async function login(email: string) {
  const jar: Jar = { cookie: "" };
  await call("/api/auth/sign-in/email", { method: "POST", json: { email, password: PW }, jar, headers: { "x-forwarded-for": `10.6.0.${(ipSeq++ % 250) + 1}` } });
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
  process.env.BETTER_AUTH_SECRET = "p".repeat(40);
  process.env.APP_URL = ORIGIN;
  delete process.env.RESEND_API_KEY;
  const { getPool } = await import("../server/db/client.js");
  pool = getPool();
  await pool.query("drop schema if exists drizzle cascade; drop schema public cascade; create schema public;");
  await (await import("drizzle-orm/node-postgres/migrator")).migrate((await import("../server/db/client.js")).db(), { migrationsFolder: "drizzle" });
  app = (await import("../server/app.js")).app;
  for (const [e, r] of [["owner", "owner"], ["admin1", "admin"], ["admin2", "admin"], ["viewer", "viewer"]] as const) await seedUser(`${e}@p.test`, r);
});
afterAll(async () => { await pool?.end(); });

const sync = (jar: Jar, key: string, changes: unknown[]) => call(`/api/data/${key}/sync`, { method: "POST", jar, json: { changes } });
const list = async (jar: Jar, key = "customers") => (await call(`/api/data/${key}`, { jar })).data.records as { id: string; version: number; data: any }[];
const byId = (rs: { id: string; version: number; data: any }[], id: string) => rs.find((r) => r.id === id)!;
const idOf = async (email: string) => (await pool.query('select id from "user" where email=$1', [email])).rows[0].id as string;

describe("PIC customer (user yang menginput)", () => {
  it("customer baru dari admin1/admin2 -> PIC = pembuatnya, terlihat oleh semua role yang bisa baca customer", async () => {
    const a1 = await login("admin1@p.test");
    const a2 = await login("admin2@p.test");
    expect((await sync(a1, "customers", [{ op: "upsert", id: "c-a1", version: 0, data: { id: "c-a1", name: "Cust A1" } }])).status).toBe(200);
    expect((await sync(a2, "customers", [{ op: "upsert", id: "c-a2", version: 0, data: { id: "c-a2", name: "Cust A2" } }])).status).toBe(200);
    for (const who of ["owner", "admin1", "viewer"]) {
      const rs = await list(await login(`${who}@p.test`));
      expect(byId(rs, "c-a1").data.pic, who).toEqual({ id: await idOf("admin1@p.test"), name: "admin1" });
      expect(byId(rs, "c-a2").data.pic, who).toEqual({ id: await idOf("admin2@p.test"), name: "admin2" });
    }
  });

  it("PIC tetap pembuat awal walau diedit user lain", async () => {
    const owner = await login("owner@p.test");
    const v = byId(await list(owner), "c-a1").version;
    expect((await sync(owner, "customers", [{ op: "upsert", id: "c-a1", version: v, data: { id: "c-a1", name: "Cust A1 (edit owner)" } }])).status).toBe(200);
    const r = byId(await list(owner), "c-a1");
    expect(r.data.name).toBe("Cust A1 (edit owner)");
    expect(r.data.pic.name).toBe("admin1");
  });

  it("pic kiriman klien diabaikan (insert dan update) dan tidak tersimpan di data", async () => {
    const a1 = await login("admin1@p.test");
    const fake = { id: "orang-lain", name: "Dipalsukan" };
    await sync(a1, "customers", [{ op: "upsert", id: "c-fake", version: 0, data: { id: "c-fake", name: "Fake", pic: fake } }]);
    let r = byId(await list(a1), "c-fake");
    expect(r.data.pic).toEqual({ id: await idOf("admin1@p.test"), name: "admin1" });
    await sync(a1, "customers", [{ op: "upsert", id: "c-fake", version: r.version, data: { id: "c-fake", name: "Fake 2", pic: fake } }]);
    r = byId(await list(a1), "c-fake");
    expect(r.data.pic.name).toBe("admin1");
    const raw = (await pool.query("select data from records where id='c-fake'")).rows[0].data;
    expect(raw.pic).toBeUndefined();
  });

  it("nama PIC ikut terkini bila user diganti namanya; user dihapus -> pic null", async () => {
    const owner = await login("owner@p.test");
    await pool.query("update \"user\" set name='Admin Satu' where email='admin1@p.test'");
    expect(byId(await list(owner), "c-a2").data.pic.name).toBe("admin2");
    expect(byId(await list(owner), "c-a1").data.pic.name).toBe("Admin Satu");
    await pool.query("delete from \"user\" where email='admin2@p.test'");
    expect(byId(await list(owner), "c-a2").data.pic).toBeNull();
  });

  it("koleksi lain tidak mendapat pic; field pic tidak masuk ke quotation/invoice", async () => {
    const a1 = await login("admin1@p.test");
    await sync(a1, "quotations", [{ op: "upsert", id: "q1", version: 0, data: { id: "q1", customerSnap: { name: "X" } } }]);
    await sync(a1, "invoices", [{ op: "upsert", id: "i1", version: 0, data: { id: "i1", customerSnap: { name: "X" } } }]);
    expect(byId(await list(a1, "quotations"), "q1").data.pic).toBeUndefined();
    expect(byId(await list(a1, "invoices"), "i1").data.pic).toBeUndefined();
  });
});
