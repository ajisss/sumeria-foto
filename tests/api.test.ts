import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";

const sent: { kind: "reset"; to: string; token: string }[] = [];
vi.mock("../server/email.js", () => ({
  sendResetPasswordEmail: async (to: string, token: string) => void sent.push({ kind: "reset", to, token }),
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
  if (init.jar && sc.length) {
    init.jar.cookie = sc.map((c) => c.split(";")[0]).join("; ");
  }
  const text = await res.text();
  let data: any = null;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data, res };
}

let ipSeq = 0;
async function login(email: string, password = PW) {
  const jar: Jar = { cookie: "" };
  const headers = { "x-forwarded-for": `10.0.${Math.floor(ipSeq / 250)}.${(ipSeq++ % 250) + 1}` };
  const r = await call("/api/auth/sign-in/email", { method: "POST", json: { email, password }, jar, headers });
  return { jar, r };
}

async function seedUser(email: string, role: string, password = PW) {
  const { auth } = await import("../server/auth.js");
  const ctx = await auth().$context;
  const u = await ctx.internalAdapter.createUser({ email, name: email.split("@")[0]!, role, banned: false, emailVerified: true }, { method: "admin" });
  await ctx.internalAdapter.createAccount({ userId: u.id, providerId: "credential", accountId: u.id, password: await ctx.password.hash(password) });
  return u.id;
}

beforeAll(async () => {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL ?? "postgres://postgres@localhost:54329/payhub";
  process.env.BETTER_AUTH_SECRET = "x".repeat(40);
  process.env.APP_URL = ORIGIN;
  delete process.env.RESEND_API_KEY;
  const { getPool } = await import("../server/db/client.js");
  pool = getPool();
  await pool.query("drop schema if exists drizzle cascade; drop schema public cascade; create schema public;");
  await (await import("drizzle-orm/node-postgres/migrator")).migrate((await import("../server/db/client.js")).db(), { migrationsFolder: "drizzle" });
  app = (await import("../server/app.js")).app;
  await seedUser("owner@x.test", "owner");
  await seedUser("admin@x.test", "admin");
  await seedUser("staff@x.test", "staff");
  await seedUser("viewer@x.test", "viewer");
  await seedUser("self1@x.test", "viewer");
  await seedUser("self2@x.test", "staff");
});
afterAll(async () => { await pool?.end(); });

describe("auth", () => {
  it("menolak akses tanpa login", async () => {
    expect((await call("/api/me")).status).toBe(401);
    expect((await call("/api/data/customers")).status).toBe(401);
    expect((await call("/api/users")).status).toBe(401);
  });

  it("sign-up publik dimatikan", async () => {
    const r = await call("/api/auth/sign-up/email", { method: "POST", json: { email: "evil@x.test", password: PW, name: "evil" } });
    expect(r.status).toBeGreaterThanOrEqual(400);
    const { rows } = await pool.query("select 1 from \"user\" where email='evil@x.test'");
    expect(rows.length).toBe(0);
  });

  it("login benar & salah", async () => {
    expect((await login("owner@x.test", "salah-salah-salah")).r.status).toBe(401);
    const { jar, r } = await login("owner@x.test");
    expect(r.status).toBe(200);
    const me = await call("/api/me", { jar });
    expect(me.status).toBe(200);
    expect(me.data.user.role).toBe("owner");
  });

  it("logout mencabut sesi", async () => {
    const { jar } = await login("viewer@x.test");
    const old = jar.cookie;
    expect((await call("/api/auth/sign-out", { method: "POST", json: {}, jar })).status).toBe(200);
    expect((await call("/api/me", { jar: { cookie: old } })).status).toBe(401);
  });

  it("origin asing ditolak untuk request mutasi", async () => {
    const { jar } = await login("staff@x.test");
    const r = await call("/api/data/customers", { method: "PUT", json: { version: 0, data: [] }, jar, origin: "https://evil.example" });
    expect(r.status).toBe(403);
  });

  it("rate limit login", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 8; i++) {
      statuses.push((await call("/api/auth/sign-in/email", { method: "POST", json: { email: "ratelimit@x.test", password: "salah-salah-salah" }, headers: { "x-forwarded-for": "9.9.9.9" } })).status);
    }
    expect(statuses).toContain(429);
  });
});

const sync = (jar: Jar, key: string, changes: unknown[]) =>
  call(`/api/data/${key}/sync`, { method: "POST", json: { changes }, jar });

describe("rbac data (per record)", () => {
  it("viewer: baca ok, sync ditolak, expenses ditolak", async () => {
    const { jar } = await login("viewer@x.test");
    expect((await call("/api/data/customers", { jar })).status).toBe(200);
    expect((await sync(jar, "customers", [{ op: "upsert", id: "v1", version: 0, data: { name: "x" } }])).status).toBe(403);
    expect((await call("/api/data/expenses", { jar })).status).toBe(403);
  });

  it("staff: tulis customers ok, expenses ditolak; koleksi tak dikenal 404", async () => {
    const { jar } = await login("staff@x.test");
    const r = await sync(jar, "customers", [{ op: "upsert", id: "c1", version: 0, data: { id: "c1", name: "A" } }]);
    expect(r.status).toBe(200);
    expect(r.data.results[0]).toMatchObject({ id: "c1", ok: true, version: 1 });
    expect((await call("/api/data/expenses", { jar })).status).toBe(403);
    expect((await sync(jar, "expenses", [{ op: "upsert", id: "e0", version: 0, data: {} }])).status).toBe(403);
    expect((await call("/api/data/nope", { jar })).status).toBe(404);
  });

  it("owner: konflik per record, record lain tetap tersimpan", async () => {
    const { jar } = await login("owner@x.test");
    const a = await sync(jar, "expenses", [
      { op: "upsert", id: "e1", version: 0, data: { id: "e1", n: 1 } },
      { op: "upsert", id: "e2", version: 0, data: { id: "e2", n: 1 } },
    ]);
    expect(a.data.results.every((x: any) => x.ok)).toBe(true);
    // Orang lain mengubah e1 -> versi 2
    expect((await sync(jar, "expenses", [{ op: "upsert", id: "e1", version: 1, data: { id: "e1", n: 2 } }])).data.results[0].version).toBe(2);
    // Klien basi (versi 1) mengedit e1 (konflik) dan e2 (ok) sekaligus
    const stale = await sync(jar, "expenses", [
      { op: "upsert", id: "e1", version: 1, data: { id: "e1", n: 99 } },
      { op: "upsert", id: "e2", version: 1, data: { id: "e2", n: 5 } },
    ]);
    expect(stale.data.results.find((x: any) => x.id === "e1")).toMatchObject({ ok: false, conflict: true });
    expect(stale.data.results.find((x: any) => x.id === "e2")).toMatchObject({ ok: true, version: 2 });
    const get = await call("/api/data/expenses", { jar });
    const byId = Object.fromEntries(get.data.records.map((r: any) => [r.id, r]));
    expect(byId.e1.data.n).toBe(2);
    expect(byId.e2.data.n).toBe(5);
    // Membuat id yang sudah ada dengan version 0 = konflik
    expect((await sync(jar, "expenses", [{ op: "upsert", id: "e1", version: 0, data: {} }])).data.results[0].conflict).toBe(true);
  });

  it("delete: versi harus cocok; sudah terhapus idempoten", async () => {
    const { jar } = await login("owner@x.test");
    expect((await sync(jar, "expenses", [{ op: "delete", id: "e1", version: 1 }])).data.results[0].conflict).toBe(true);
    expect((await sync(jar, "expenses", [{ op: "delete", id: "e1", version: 2 }])).data.results[0].ok).toBe(true);
    expect((await sync(jar, "expenses", [{ op: "delete", id: "e1", version: 2 }])).data.results[0].ok).toBe(true);
    const ids = (await call("/api/data/expenses", { jar })).data.records.map((r: any) => r.id);
    expect(ids).not.toContain("e1");
  });

  it("hapus invoice ikut menghapus pengeluaran Project yang terhubung (bahkan oleh role tanpa akses expenses)", async () => {
    const owner = (await login("owner@x.test")).jar;
    const staff = (await login("staff@x.test")).jar;
    await sync(owner, "invoices", [
      { op: "upsert", id: "inv-casc", version: 0, data: { id: "inv-casc" } },
      { op: "upsert", id: "inv-keep", version: 0, data: { id: "inv-keep" } },
    ]);
    await sync(owner, "expenses", [
      { op: "upsert", id: "ex-casc1", version: 0, data: { id: "ex-casc1", category: "Project", invoiceId: "inv-casc" } },
      { op: "upsert", id: "ex-casc2", version: 0, data: { id: "ex-casc2", category: "Project", invoiceId: "inv-casc" } },
      { op: "upsert", id: "ex-keep", version: 0, data: { id: "ex-keep", category: "Project", invoiceId: "inv-keep" } },
      { op: "upsert", id: "ex-other", version: 0, data: { id: "ex-other", category: "Marketing", invoiceId: "" } },
    ]);
    // staff tidak punya akses expenses, tapi boleh menghapus invoice
    expect((await call("/api/data/expenses", { jar: staff })).status).toBe(403);
    const del = await sync(staff, "invoices", [{ op: "delete", id: "inv-casc", version: 1 }]);
    expect(del.data.results[0].ok).toBe(true);
    expect(del.data.cascaded).toBe(2);
    const ids = (await call("/api/data/expenses", { jar: owner })).data.records.map((r: any) => r.id);
    expect(ids).not.toContain("ex-casc1");
    expect(ids).not.toContain("ex-casc2");
    expect(ids).toContain("ex-keep");
    expect(ids).toContain("ex-other");
    // menghapus invoice yang sudah hilang (idempoten) tidak menghapus apa pun lagi
    expect((await sync(staff, "invoices", [{ op: "delete", id: "inv-casc", version: 1 }])).data.cascaded).toBe(0);
  });

  it("customer: nomor telepon / email yang sama ditolak (semua format nomor, email tak peka huruf besar)", async () => {
    const admin = (await login("admin@x.test")).jar;
    const up = (id: string, data: Record<string, unknown>, version = 0) => sync(admin, "customers", [{ op: "upsert", id, version, data: { id, ...data } }]);
    expect((await up("dup-a", { name: "Dina", phone: "0812-1111-2222", email: "Dina@Mail.com" })).data.results[0].ok).toBe(true);
    // nomor sama dengan format lain: 0xxx, +62 xxx, 62xxx
    for (const phone of ["081211112222", "+62 812 1111 2222", "6281211112222"]) {
      const r = (await up("dup-b", { name: "Bayu", phone })).data.results[0];
      expect(r).toMatchObject({ ok: false, duplicate: { field: "phone", name: "Dina" } });
    }
    // email sama (beda huruf besar & spasi)
    expect((await up("dup-b", { name: "Bayu", phone: "0813-0000-0001", email: " dina@mail.COM " })).data.results[0]).toMatchObject({ ok: false, duplicate: { field: "email", name: "Dina" } });
    // data unik diterima; kosong tidak dianggap sama
    expect((await up("dup-b", { name: "Bayu", phone: "0813-0000-0001", email: "bayu@mail.com" })).data.results[0].ok).toBe(true);
    expect((await up("dup-c", { name: "Cici", phone: "", email: "" })).data.results[0].ok).toBe(true);
    expect((await up("dup-d", { name: "Dodi", phone: "", email: "" })).data.results[0].ok).toBe(true);
    // edit tanpa mengubah nomor/email tetap boleh; mengganti ke milik orang lain ditolak
    expect((await up("dup-a", { name: "Dina Baru", phone: "0812-1111-2222", email: "Dina@Mail.com" }, 1)).data.results[0].ok).toBe(true);
    expect((await up("dup-b", { name: "Bayu", phone: "0812 1111 2222", email: "bayu@mail.com" }, 1)).data.results[0]).toMatchObject({ ok: false, duplicate: { field: "phone" } });
    // dua customer ganda dalam satu batch: yang kedua ditolak
    const batch = await sync(admin, "customers", [
      { op: "upsert", id: "dup-e", version: 0, data: { id: "dup-e", name: "Eka", phone: "0899-5555-6666" } },
      { op: "upsert", id: "dup-f", version: 0, data: { id: "dup-f", name: "Fani", phone: "+62 899 5555 6666" } },
    ]);
    expect(batch.data.results.map((r: any) => r.ok)).toEqual([true, false]);
    // data lama yang sudah ganda (sebelum aturan ini) masih bisa diedit selama nomor/email tidak diubah
    await pool.query("insert into records (collection, id, data) values ('customers','legacy-1','{\"id\":\"legacy-1\",\"name\":\"L1\",\"phone\":\"0877-0000-0001\"}'),('customers','legacy-2','{\"id\":\"legacy-2\",\"name\":\"L2\",\"phone\":\"0877-0000-0001\"}')");
    expect((await up("legacy-2", { name: "L2 edit", phone: "0877-0000-0001" }, 1)).data.results[0].ok).toBe(true);
    // menghapus customer membebaskan nomornya
    await sync(admin, "customers", [{ op: "delete", id: "dup-e", version: 1 }]);
    expect((await up("dup-f", { name: "Fani", phone: "0899-5555-6666" })).data.results[0].ok).toBe(true);
  });

  it("rev: tidak berubah -> unchanged; berubah -> data baru; urutan sisip terjaga", async () => {
    const { jar } = await login("owner@x.test");
    const first = await call("/api/data/expenses", { jar });
    expect((await call(`/api/data/expenses?rev=${encodeURIComponent(first.data.rev)}`, { jar })).data.unchanged).toBe(true);
    await sync(jar, "expenses", [{ op: "upsert", id: "e0z", version: 0, data: { id: "e0z" } }]);
    const next = await call(`/api/data/expenses?rev=${encodeURIComponent(first.data.rev)}`, { jar });
    expect(next.data.unchanged).toBeUndefined();
    expect(next.data.records.map((r: any) => r.id).at(-1)).toBe("e0z");
  });

  it("admin: hanya Sales + Customer; tanpa expenses, users, analytics finance", async () => {
    const { jar } = await login("admin@x.test");
    for (const k of ["customers", "quotations", "invoices", "packages"]) {
      expect((await call(`/api/data/${k}`, { jar })).status, k).toBe(200);
      expect((await sync(jar, k, [{ op: "upsert", id: "adm-" + k, version: 0, data: { id: "adm-" + k } }])).status, k).toBe(200);
    }
    expect((await call("/api/data/expenses", { jar })).status).toBe(403);
    expect((await sync(jar, "expenses", [{ op: "upsert", id: "adm-e", version: 0, data: {} }])).status).toBe(403);
    expect((await call("/api/users", { jar })).status).toBe(403);
    expect((await call("/api/analytics?start=2026-01-01&end=2026-02-28", { jar })).status).toBe(403);
    const me = (await call("/api/me", { jar })).data.permissions as string[];
    expect(me).not.toContain("analytics:finance");
    expect(me).not.toContain("read:expenses");
    expect(me).not.toContain("users:manage");
  });

  it("payload tidak valid ditolak", async () => {
    const { jar } = await login("admin@x.test");
    expect((await sync(jar, "customers", [])).status).toBe(400);
    expect((await sync(jar, "customers", [{ op: "upsert", id: "", version: 0, data: {} }])).status).toBe(400);
    expect((await sync(jar, "customers", [{ op: "upsert", id: "a", version: 0, data: [1] }])).status).toBe(400);
    expect((await sync(jar, "customers", [{ op: "upsert", id: "d", version: 0, data: {} }, { op: "upsert", id: "d", version: 0, data: {} }])).status).toBe(400);
    expect((await sync(jar, "customers", [{ op: "upsert", id: "big", version: 0, data: { s: "x".repeat(300 * 1024) } }])).status).toBe(413);
  });
});

describe("akun sendiri", () => {
  it("update-user tidak bisa menaikkan role/banned (mass assignment)", async () => {
    const { jar } = await login("self1@x.test");
    const me0 = await call("/api/me", { jar });
    expect(me0.status).toBe(200);
    const evil = await call("/api/auth/update-user", { method: "POST", json: { name: "Nama Baru", role: "owner", banned: true }, jar });
    expect(evil.status).toBeGreaterThanOrEqual(400);
    expect((await call("/api/me", { jar })).data.user.role).toBe("viewer");
    expect((await call("/api/auth/update-user", { method: "POST", json: { name: "Nama Baru" }, jar })).status).toBe(200);
    const me = await call("/api/me", { jar });
    expect(me.status).toBe(200);
    expect(me.data.user.role).toBe("viewer");
    expect(me.data.user.name).toBe("Nama Baru");
  });

  it("ganti password: butuh password lama; sesi lain dicabut", async () => {
    const a = await login("self2@x.test");
    const b = await login("self2@x.test");
    const bad = await call("/api/auth/change-password", { method: "POST", json: { currentPassword: "salah-salah-1", newPassword: "ganti-password-1", revokeOtherSessions: true }, jar: a.jar });
    expect(bad.status).toBeGreaterThanOrEqual(400);
    const ok = await call("/api/auth/change-password", { method: "POST", json: { currentPassword: PW, newPassword: "ganti-password-1", revokeOtherSessions: true }, jar: a.jar });
    expect(ok.status).toBe(200);
    expect((await call("/api/me", { jar: b.jar })).status).toBe(401);
    expect((await login("self2@x.test", "ganti-password-1")).r.status).toBe(200);
  });
});

describe("cron cleanup", () => {
  it("mati tanpa CRON_SECRET, butuh bearer yang benar bila aktif", async () => {
    expect((await call("/api/cron/cleanup")).status).toBe(404);
    process.env.CRON_SECRET = "s".repeat(24);
    const { env } = await import("../server/env.js");
    // env() di-cache; paksa baca ulang dengan menyetel field langsung
    (env() as any).CRON_SECRET = process.env.CRON_SECRET;
    expect((await call("/api/cron/cleanup")).status).toBe(401);
    expect((await call("/api/cron/cleanup", { headers: { authorization: "Bearer salah" } })).status).toBe(401);
    const ok = await call("/api/cron/cleanup", { headers: { authorization: `Bearer ${"s".repeat(24)}` } });
    expect(ok.status).toBe(200);
    expect(ok.data).toHaveProperty("sessions");
  });
});

describe("kelola user", () => {
  it("staff/viewer tidak bisa akses /api/users", async () => {
    for (const e of ["staff@x.test", "viewer@x.test"]) {
      const { jar } = await login(e);
      expect((await call("/api/users", { jar })).status).toBe(403);
    }
  });

  it("admin tidak bisa membuat akun atau reset password (hanya owner)", async () => {
    const { jar } = await login("admin@x.test");
    const r = await call("/api/users", { method: "POST", json: { email: "x1@x.test", name: "N", role: "staff", password: "password-panjang-1" }, jar });
    expect(r.status).toBe(403);
    expect((await call(`/api/users/anything/reset-password`, { method: "POST", json: { password: "password-panjang-1" }, jar })).status).toBe(403);
  });

  it("owner membuat akun dengan credential: bisa login, role benar, password tersimpan sebagai hash", async () => {
    const { jar } = await login("owner@x.test");
    const ok = await call("/api/users", { method: "POST", json: { email: "Sales1@X.test", name: "Sales Satu", role: "admin", password: "password-awal-123" }, jar });
    expect(ok.status).toBe(201);
    const { r, jar: sj } = await login("sales1@x.test", "password-awal-123");
    expect(r.status).toBe(200);
    expect((await call("/api/me", { jar: sj })).data.user.role).toBe("admin");
    const row = await pool.query("select password from account where provider_id='credential' and user_id=$1", [ok.data.id]);
    expect(row.rows[0].password).not.toContain("password-awal-123");
    // email duplikat (beda huruf) ditolak
    expect((await call("/api/users", { method: "POST", json: { email: "sales1@x.test", name: "Dup", role: "staff", password: "password-awal-123" }, jar })).status).toBe(409);
  });

  it("validasi: password pendek, role liar, email jelek ditolak", async () => {
    const { jar } = await login("owner@x.test");
    for (const body of [
      { email: "p1@x.test", name: "P", role: "viewer", password: "pendek" },
      { email: "p2@x.test", name: "P", role: "superadmin", password: "password-panjang-1" },
      { email: "bukan-email", name: "P", role: "viewer", password: "password-panjang-1" },
      { email: "p3@x.test", name: "", role: "viewer", password: "password-panjang-1" },
      { email: "p4@x.test", name: "P", role: "viewer" },
    ]) {
      expect((await call("/api/users", { method: "POST", json: body, jar })).status, JSON.stringify(body)).toBe(400);
    }
  });

  it("owner reset password user: password lama mati, sesi dicabut, password baru jalan", async () => {
    const owner = (await login("owner@x.test")).jar;
    const users = (await call("/api/users", { jar: owner })).data.users as any[];
    const id = users.find((u) => u.email === "sales1@x.test").id;
    const old = (await login("sales1@x.test", "password-awal-123")).jar;
    expect((await call("/api/me", { jar: old })).status).toBe(200);
    expect((await call(`/api/users/${id}/reset-password`, { method: "POST", json: { password: "pendek" }, jar: owner })).status).toBe(400);
    expect((await call(`/api/users/${id}/reset-password`, { method: "POST", json: { password: "password-reset-456" }, jar: owner })).status).toBe(200);
    expect((await call("/api/me", { jar: old })).status).toBe(401);
    expect((await login("sales1@x.test", "password-awal-123")).r.status).toBe(401);
    expect((await login("sales1@x.test", "password-reset-456")).r.status).toBe(200);
    expect((await call(`/api/users/ghost-id/reset-password`, { method: "POST", json: { password: "password-reset-456" }, jar: owner })).status).toBe(404);
  });

  it("endpoint undangan lama sudah tidak ada", async () => {
    const { jar } = await login("owner@x.test");
    expect((await call("/api/users/invite", { method: "POST", json: { email: "i@x.test", name: "I", role: "viewer" }, jar })).status).toBe(404);
  });

  it("lupa password: email terdaftar & tidak terdaftar dijawab sama", async () => {
    const a = await call("/api/auth/request-password-reset", { method: "POST", json: { email: "viewer@x.test" }, headers: { "x-forwarded-for": "1.1.1.1" } });
    const b = await call("/api/auth/request-password-reset", { method: "POST", json: { email: "ghost@x.test" }, headers: { "x-forwarded-for": "1.1.1.1" } });
    expect(a.status).toBe(200);
    expect(b.status).toBe(200);
    expect(a.data).toEqual(b.data);
    await new Promise((r) => setTimeout(r, 50));
    expect(sent.some((s) => s.kind === "reset" && s.to === "viewer@x.test")).toBe(true);
    expect(sent.some((s) => s.to === "ghost@x.test")).toBe(false);
  });

  it("reset password mencabut sesi lama", async () => {
    const { jar } = await login("viewer@x.test");
    expect((await call("/api/me", { jar })).status).toBe(200);
    const mail = sent.filter((s) => s.kind === "reset" && s.to === "viewer@x.test").at(-1)!;
    expect((await call("/api/auth/reset-password", { method: "POST", json: { token: mail.token, newPassword: "viewer-pass-baru-1" } })).status).toBe(200);
    expect((await call("/api/me", { jar })).status).toBe(401);
    expect((await login("viewer@x.test", PW)).r.status).toBe(401);
    expect((await login("viewer@x.test", "viewer-pass-baru-1")).r.status).toBe(200);
  });

  it("ban: sesi dicabut & tidak bisa login; admin tak bisa mengelola user; owner tak bisa ban diri sendiri", async () => {
    const owner = (await login("owner@x.test")).jar;
    const users = (await call("/api/users", { jar: owner })).data.users as any[];
    const id = (e: string) => users.find((u) => u.email === e).id;

    const staffJar = (await login("staff@x.test")).jar;
    expect((await call(`/api/users/${id("staff@x.test")}`, { method: "PATCH", json: { banned: true }, jar: owner })).status).toBe(200);
    expect((await call("/api/me", { jar: staffJar })).status).toBe(401);
    expect((await login("staff@x.test")).r.status).toBe(403);

    const admin = (await login("admin@x.test")).jar;
    // admin tidak punya users:manage: semua ditolak
    expect((await call(`/api/users/${id("owner@x.test")}`, { method: "PATCH", json: { banned: true }, jar: admin })).status).toBe(403);
    expect((await call(`/api/users/${id("admin@x.test")}`, { method: "PATCH", json: { role: "viewer" }, jar: admin })).status).toBe(403);
    expect((await call(`/api/users/${id("viewer@x.test")}`, { method: "PATCH", json: { role: "owner" }, jar: admin })).status).toBe(403);
    // owner tidak bisa ban diri sendiri
    expect((await call(`/api/users/${id("owner@x.test")}`, { method: "PATCH", json: { banned: true }, jar: owner })).status).toBe(400);
  });

  it("selalu ada minimal satu owner aktif", async () => {
    const owner = (await login("owner@x.test")).jar;
    const users = (await call("/api/users", { jar: owner })).data.users as any[];
    const adminId = users.find((u) => u.email === "admin@x.test").id;
    const me = users.find((u) => u.email === "owner@x.test").id;
    // jadikan admin owner kedua, lalu admin (owner) turunkan owner pertama -> boleh karena owner lain ada
    expect((await call(`/api/users/${adminId}`, { method: "PATCH", json: { role: "owner" }, jar: owner })).status).toBe(200);
    const admin2 = (await login("admin@x.test")).jar;
    expect((await call(`/api/users/${me}`, { method: "PATCH", json: { role: "viewer" }, jar: admin2 })).status).toBe(200);
    // sekarang admin2 adalah satu-satunya owner: tidak bisa menurunkan diri (self) -> 400
    expect((await call(`/api/users/${adminId}`, { method: "PATCH", json: { role: "viewer" }, jar: admin2 })).status).toBe(400);
  });
});

describe("analytics", () => {
  const mkInv = (id: string, date: string, cust: string, items: any[], paidCount: number, paidDate = date) => {
    const total = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
    return {
      id, date, customerSnap: { name: cust }, items,
      payments: [0, 1].map((n) => ({ amount: total / 2, paid: n < paidCount, paidDate: n < paidCount ? paidDate : null })),
    };
  };
  const item = (packageItem: string, qty: number, unitPrice: number, eventDate?: string) => ({ packageItem, qty, unitPrice, discount: 0, eventDate });

  it("mengagregasi invoice & expense, dan menjaga akses per role", async () => {
    await seedUser("analytics-owner@x.test", "owner");
    const owner = (await login("analytics-owner@x.test")).jar;
    const invoices = [
      mkInv("an-a1", "2026-01-10", "Budi", [item("Photo", 1, 4_000_000)], 2),
      mkInv("an-a2", "2026-02-05", "Sari", [item("Video", 2, 3_000_000, "2026-03-01")], 1),
      mkInv("an-a3", "2026-02-20", "Budi", [item("Photo", 1, 1_000_000)], 0),
      mkInv("an-old", "2025-12-20", "Budi", [item("Photo", 1, 1_000_000)], 2),
    ];
    const sync = (key: string, recs: { id: string; data: object }[]) =>
      call(`/api/data/${key}/sync`, { method: "POST", jar: owner, json: { changes: recs.map((r) => ({ op: "upsert", id: r.id, version: 0, data: r.data })) } });
    const s1 = await sync("invoices", invoices.map((d) => ({ id: d.id, data: d })));
    expect(s1.status, JSON.stringify(s1.data)).toBe(200);
    const exps = [{ id: "an-e1", date: "2026-01-15", qty: 1, unitPrice: 1_500_000, discount: 500_000 }, { id: "an-e2", date: "2026-02-01", qty: 2, unitPrice: 250_000, discount: 0 }];
    expect((await sync("expenses", exps.map((d) => ({ id: d.id, data: d })))).status).toBe(200);

    const r = await call("/api/analytics?start=2026-01-01&end=2026-02-28&today=2026-02-25", { jar: owner });
    expect(r.status).toBe(200);
    const d = r.data;
    expect(d.canExpenses).toBe(true);
    // revenue: a1 6jt? (4jt: 2 payments @2jt) + a2 DP 3jt = 4jt + 3jt
    expect(d.current.revenue).toBe(7_000_000);
    expect(d.current.expenses).toBe(1_000_000 + 500_000);
    expect(d.current.profit).toBe(7_000_000 - 1_500_000);
    expect(d.current.invoiced).toBe(4_000_000 + 6_000_000 + 1_000_000);
    expect(d.current.outstanding).toBe(11_000_000 - 7_000_000);
    expect(d.status).toEqual({ total: 3, paid: 1, partial: 1, unpaid: 1, overdue: 1 });
    expect(d.months.map((m: any) => m.key)).toEqual(["2026-01", "2026-02"]);
    expect(d.months[0].revenue).toBe(4_000_000);
    expect(d.topCustomers[0].name).toBe("Budi");
    expect(d.topItems[0].name).toBe("Video");
    expect(d.customers).toEqual(["Budi", "Sari"]);
    // periode sebelumnya = 2 bulan sebelum 1 Jan (59 hari): hanya invoice Des 2025
    expect(d.prev).toEqual({ start: "2025-11-03", end: "2025-12-31" });
    expect(d.previous.revenue).toBe(1_000_000);

    // filter customer
    const f = await call("/api/analytics?start=2026-01-01&end=2026-02-28&customer=Sari", { jar: owner });
    expect(f.data.current.revenue).toBe(3_000_000);
    expect(f.data.status.total).toBe(1);

    // viewer: boleh baca invoice, tapi tanpa expense
    await seedUser("analytics-viewer@x.test", "viewer");
    const viewer = (await login("analytics-viewer@x.test")).jar;
    const v = await call("/api/analytics?start=2026-01-01&end=2026-02-28", { jar: viewer });
    expect(v.status).toBe(200);
    expect(v.data.canExpenses).toBe(false);
    expect(v.data.current.expenses).toBeNull();
    expect(v.data.current.profit).toBeNull();
    expect(v.data.current.revenue).toBe(7_000_000);

    expect((await call("/api/analytics?start=bukan-tanggal", { jar: owner })).status).toBe(400);
    expect((await call("/api/analytics")).status).toBe(401);
  });
});
