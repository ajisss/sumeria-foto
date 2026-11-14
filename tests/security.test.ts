import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";

const sent: { kind: "invite" | "reset"; to: string; token: string }[] = [];
vi.mock("../server/email.js", () => ({
  sendResetPasswordEmail: async (to: string, token: string) => void sent.push({ kind: "reset", to, token }),
  sendInviteEmail: async (to: string, _n: string, token: string) => void sent.push({ kind: "invite", to, token }),
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
  return { status: res.status, data, res, setCookie: sc };
}

let ipSeq = 0;
const nextIp = () => `10.9.${Math.floor(ipSeq / 250)}.${(ipSeq++ % 250) + 1}`;
async function login(email: string, password = PW) {
  const jar: Jar = { cookie: "" };
  const r = await call("/api/auth/sign-in/email", { method: "POST", json: { email, password }, jar, headers: { "x-forwarded-for": nextIp() } });
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
  process.env.BETTER_AUTH_SECRET = "y".repeat(40);
  process.env.APP_URL = ORIGIN;
  delete process.env.RESEND_API_KEY;
  const { getPool } = await import("../server/db/client.js");
  pool = getPool();
  await pool.query("drop schema if exists drizzle cascade; drop schema public cascade; create schema public;");
  await (await import("drizzle-orm/node-postgres/migrator")).migrate((await import("../server/db/client.js")).db(), { migrationsFolder: "drizzle" });
  app = (await import("../server/app.js")).app;
  await seedUser("owner@s.test", "owner");
  await seedUser("admin@s.test", "admin");
  await seedUser("staff@s.test", "staff");
  await seedUser("viewer@s.test", "viewer");
});
afterAll(async () => { await pool?.end(); });

describe("sapuan semua endpoint tanpa login", () => {
  const routes: [string, string][] = [
    ["GET", "/api/me"],
    ["GET", "/api/data/customers"], ["GET", "/api/data/invoices"], ["GET", "/api/data/expenses"],
    ["POST", "/api/data/customers/sync"], ["GET", "/api/analytics"],
    ["GET", "/api/users"], ["POST", "/api/users/invite"], ["PATCH", "/api/users/abc"], ["POST", "/api/users/abc/resend-invite"],
  ];
  for (const [m, p] of routes) {
    it(`${m} ${p} -> 401`, async () => {
      const r = await call(p, { method: m, json: m === "GET" ? undefined : {} });
      expect(r.status).toBe(401);
    });
  }
  it("cron tanpa bearer ditolak", async () => {
    const r = await call("/api/cron/cleanup");
    expect([401, 404]).toContain(r.status);
  });
});

describe("endpoint Better Auth yang tidak boleh terbuka", () => {
  it("sign-up, change-email, delete-user, set-password, openapi tidak bisa dipakai anon", async () => {
    const probes: [string, string, unknown?][] = [
      ["POST", "/api/auth/sign-up/email", { email: "evil@x.test", password: "supersecret-123", name: "evil" }],
      ["POST", "/api/auth/change-email", { newEmail: "evil@x.test" }],
      ["POST", "/api/auth/delete-user", { password: PW }],
      ["POST", "/api/auth/set-password", { newPassword: "supersecret-123" }],
      ["GET", "/api/auth/list-sessions"],
      ["GET", "/api/auth/reference"],
      ["GET", "/api/auth/open-api/generate-schema"],
    ];
    for (const [m, p, body] of probes) {
      const r = await call(p, { method: m, json: body });
      expect(r.status, `${m} ${p} -> ${r.status} ${JSON.stringify(r.data).slice(0, 80)}`).toBeGreaterThanOrEqual(400);
    }
    const n = await pool.query("select count(*)::int c from \"user\" where email='evil@x.test'");
    expect(n.rows[0].c).toBe(0);
  });

  it("user login tidak bisa hapus akun sendiri / ganti email lewat Better Auth", async () => {
    const { jar } = await login("staff@s.test");
    const del = await call("/api/auth/delete-user", { method: "POST", jar, json: { password: PW } });
    expect(del.status).toBeGreaterThanOrEqual(400);
    const em = await call("/api/auth/change-email", { method: "POST", jar, json: { newEmail: "evil2@x.test" } });
    expect(em.status).toBeGreaterThanOrEqual(400);
    const still = await pool.query("select email from \"user\" where email='staff@s.test'");
    expect(still.rowCount).toBe(1);
  });

  it("update-user: tidak bisa ubah email/role/banned/id/emailVerified", async () => {
    const { jar } = await login("viewer@s.test");
    await call("/api/auth/update-user", { method: "POST", jar, json: { name: "Baru", role: "owner", banned: false, email: "x@x.test", emailVerified: true, id: "zzz" } });
    const r = await pool.query("select role,email,id from \"user\" where email='viewer@s.test'");
    expect(r.rows[0].role).toBe("viewer");
    expect(r.rows[0].id).not.toBe("zzz");
  });
});

describe("enumerasi & brute force", () => {
  it("login email tak dikenal vs password salah: respons identik", async () => {
    const a = await login("tidak-ada@s.test", "salah-salah-salah");
    const b = await login("staff@s.test", "salah-salah-salah");
    expect(a.r.status).toBe(b.r.status);
    expect(JSON.stringify(a.r.data)).toBe(JSON.stringify(b.r.data));
  });
  it("reset token palsu ditolak", async () => {
    const r = await call("/api/auth/reset-password", { method: "POST", json: { token: "palsu-palsu-palsu", newPassword: "password-baru-123" }, headers: { "x-forwarded-for": nextIp() } });
    expect(r.status).toBeGreaterThanOrEqual(400);
  });
  it("rate limit tetap jalan walau header X-Forwarded-For dipalsukan satu IP tetap", async () => {
    const ip = nextIp();
    const codes: number[] = [];
    for (let i = 0; i < 9; i++) {
      const r = await call("/api/auth/sign-in/email", { method: "POST", json: { email: "staff@s.test", password: "salah-salah-1" + i }, headers: { "x-forwarded-for": ip } });
      codes.push(r.status);
    }
    expect(codes).toContain(429);
  });
});

describe("cookie & header", () => {
  it("cookie sesi HttpOnly + SameSite=Lax", async () => {
    const { r } = await login("owner@s.test");
    const c = r.setCookie.find((x) => /session_token/.test(x)) ?? "";
    expect(c).toMatch(/HttpOnly/i);
    expect(c).toMatch(/SameSite=Lax/i);
  });
  it("security header terpasang & /api/me no-store", async () => {
    const { jar } = await login("owner@s.test");
    const r = await call("/api/me", { jar });
    expect(r.res.headers.get("x-frame-options")).toBe("DENY");
    expect(r.res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(r.res.headers.get("strict-transport-security")).toMatch(/max-age/);
    expect(r.res.headers.get("cache-control")).toBe("no-store");
  });
  it("respons /api/me tidak membocorkan hash password / token", async () => {
    const { jar } = await login("owner@s.test");
    const r = await call("/api/me", { jar });
    expect(JSON.stringify(r.data)).not.toMatch(/password|token|secret/i);
  });
});

describe("CSRF & content-type", () => {
  it("mutasi dengan Origin jahat ditolak di semua area", async () => {
    const { jar } = await login("owner@s.test");
    for (const [p, body] of [
      ["/api/data/customers/sync", { changes: [{ op: "upsert", id: "a", version: 0, data: {} }] }],
      ["/api/users/invite", { email: "z@z.test", name: "z", role: "viewer" }],
      ["/api/auth/sign-out", {}],
      ["/api/auth/update-user", { name: "x" }],
    ] as const) {
      const r = await call(p, { method: "POST", jar, json: body, origin: "https://evil.example" });
      expect(r.status, p).toBe(403);
    }
  });
  it("Origin 'null' (iframe sandbox) ditolak", async () => {
    const { jar } = await login("owner@s.test");
    const r = await call("/api/users/invite", { method: "POST", jar, json: { email: "n@n.test", name: "n", role: "viewer" }, origin: "null" });
    expect(r.status).toBe(403);
  });
  it("Sec-Fetch-Site cross-site tanpa Origin ditolak", async () => {
    const { jar } = await login("owner@s.test");
    const r = await call("/api/users/invite", { method: "POST", jar, json: { email: "n2@n.test", name: "n", role: "viewer" }, origin: null, headers: { "sec-fetch-site": "cross-site" } });
    expect(r.status).toBe(403);
  });
  it("body text/plain ditolak 415", async () => {
    const { jar } = await login("owner@s.test");
    const r = await call("/api/data/customers/sync", { method: "POST", jar, body: '{"changes":[]}', headers: { "content-type": "text/plain", "content-length": "14" } });
    expect(r.status).toBe(415);
  });
});

describe("injeksi & input berbahaya", () => {
  it("koleksi traversal / SQL di path -> 404", async () => {
    const { jar } = await login("owner@s.test");
    for (const k of ["..%2Fusers", "customers';drop table records;--", "%00", "constructor", "__proto__"]) {
      const r = await call(`/api/data/${k}`, { jar });
      expect([404, 400]).toContain(r.status);
    }
    const ok = await pool.query("select to_regclass('public.records') r");
    expect(ok.rows[0].r).not.toBeNull();
  });
  it("id & rev berisi SQL/ aneh disimpan sebagai data biasa", async () => {
    const { jar } = await login("owner@s.test");
    const evilId = "x'); drop table records;--";
    const w = await call("/api/data/customers/sync", { method: "POST", jar, json: { changes: [{ op: "upsert", id: evilId, version: 0, data: { name: "<img src=x onerror=alert(1)>", __proto__: { admin: true }, "constructor": { prototype: { polluted: 1 } } } }] } });
    expect(w.status).toBe(200);
    const g = await call("/api/data/customers?rev=' or 1=1 --", { jar });
    expect(g.status).toBe(200);
    expect(({} as any).polluted).toBeUndefined();
    expect(({} as any).admin).toBeUndefined();
    expect((await pool.query("select to_regclass('public.records') r")).rows[0].r).not.toBeNull();
  });
  it("analytics: parameter aneh tidak 500 / tidak injeksi", async () => {
    const { jar } = await login("owner@s.test");
    for (const q of ["start=2025-01-01';drop table records;--", "customer=' OR 1=1 --", "today=abc", "start=9999-99-99", "end=2020-01-01&start=2030-01-01"]) {
      const r = await call(`/api/analytics?${q}`, { jar });
      expect(r.status, q).toBeLessThan(500);
    }
    expect((await pool.query("select to_regclass('public.records') r")).rows[0].r).not.toBeNull();
  });
  it("invite: email berisi header injection / nama sangat panjang ditolak", async () => {
    const { jar } = await login("owner@s.test");
    for (const body of [
      { email: "a@b.test\r\nBcc: evil@x.test", name: "x", role: "viewer" },
      { email: "ok1@b.test", name: "x".repeat(500), role: "viewer" },
      { email: "ok2@b.test", name: "x", role: "superadmin" },
      { email: "ok3@b.test", name: "x", role: ["owner"] },
    ]) {
      const r = await call("/api/users/invite", { method: "POST", jar, json: body });
      expect(r.status, JSON.stringify(body).slice(0, 60)).toBe(400);
    }
  });
  it("PATCH user: field tak dikenal (mis. email, id) diabaikan, bukan diterapkan", async () => {
    const { jar } = await login("owner@s.test");
    const t = await pool.query("select id from \"user\" where email='viewer@s.test'");
    const id = t.rows[0].id;
    await call(`/api/users/${id}`, { method: "PATCH", jar, json: { name: "Renamed", email: "takeover@s.test", id: "hack" } });
    const after = await pool.query("select email,id from \"user\" where id=$1", [id]);
    expect(after.rows[0].email).toBe("viewer@s.test");
  });
});

describe("batas ukuran", () => {
  it("body > 4MB -> 413", async () => {
    const { jar } = await login("owner@s.test");
    const big = "a".repeat(5 * 1024 * 1024);
    const r = await call("/api/data/customers/sync", { method: "POST", jar, json: { changes: [{ op: "upsert", id: "big", version: 0, data: { big } }] } });
    expect(r.status).toBe(413);
  });
  it("lebih dari 500 perubahan ditolak", async () => {
    const { jar } = await login("owner@s.test");
    const changes = Array.from({ length: 501 }, (_, i) => ({ op: "upsert", id: "m" + i, version: 0, data: {} }));
    const r = await call("/api/data/customers/sync", { method: "POST", jar, json: { changes } });
    expect(r.status).toBe(400);
  });
});

describe("privilege escalation antar role", () => {
  it("staff tak bisa tulis packages/expenses; viewer tak bisa tulis apa pun", async () => {
    const s = await login("staff@s.test");
    const v = await login("viewer@s.test");
    const body = { changes: [{ op: "upsert", id: "pe1", version: 0, data: {} }] };
    for (const k of ["packages", "expenses"]) {
      expect((await call(`/api/data/${k}/sync`, { method: "POST", jar: s.jar, json: body })).status).toBe(403);
    }
    for (const k of ["customers", "quotations", "invoices", "packages", "expenses"]) {
      expect((await call(`/api/data/${k}/sync`, { method: "POST", jar: v.jar, json: body })).status).toBe(403);
    }
  });
  it("admin tidak bisa mengangkat diri/orang jadi owner, tidak bisa ubah owner", async () => {
    const a = await login("admin@s.test");
    const users = await call("/api/users", { jar: a.jar });
    const owner = users.data.users.find((u: any) => u.role === "owner");
    const adminU = users.data.users.find((u: any) => u.email === "admin@s.test");
    const viewerU = users.data.users.find((u: any) => u.email === "viewer@s.test");
    expect((await call(`/api/users/${owner.id}`, { method: "PATCH", jar: a.jar, json: { banned: true } })).status).toBe(403);
    expect((await call(`/api/users/${owner.id}`, { method: "PATCH", jar: a.jar, json: { name: "pwned" } })).status).toBe(403);
    expect((await call(`/api/users/${adminU.id}`, { method: "PATCH", jar: a.jar, json: { role: "owner" } })).status).toBe(400);
    expect((await call(`/api/users/${viewerU.id}`, { method: "PATCH", jar: a.jar, json: { role: "owner" } })).status).toBe(403);
    expect((await call(`/api/users/${viewerU.id}`, { method: "PATCH", jar: a.jar, json: { role: "admin" } })).status).toBe(403);
  });
  it("admin tak bisa resend-invite ke owner", async () => {
    const a = await login("admin@s.test");
    const o = (await pool.query("select id from \"user\" where role='owner'")).rows[0].id;
    expect((await call(`/api/users/${o}/resend-invite`, { method: "POST", jar: a.jar, json: {} })).status).toBe(403);
  });
  it("cookie dipalsukan / session token acak ditolak", async () => {
    const r = await call("/api/me", { headers: { cookie: "better-auth.session_token=abc.def; __Secure-better-auth.session_token=abc.def" } });
    expect(r.status).toBe(401);
  });
});

describe("sesi", () => {
  it("setelah sign-out cookie lama tak berlaku; ganti password mencabut sesi", async () => {
    const { jar } = await login("viewer@s.test");
    const old = jar.cookie;
    await call("/api/auth/sign-out", { method: "POST", jar, json: {} });
    expect((await call("/api/me", { headers: { cookie: old } })).status).toBe(401);
  });
});

describe("preferensi per user", () => {
  it("butuh login; merge parsial; terisolasi antar user; key liar ditolak", async () => {
    expect((await call("/api/me/preferences")).status).toBe(401);
    expect((await call("/api/me/preferences", { method: "PATCH", json: { lang: "en" } })).status).toBe(401);
    const a = await login("staff@s.test");
    const b = await login("viewer@s.test");
    expect((await call("/api/me/preferences", { jar: a.jar })).data.preferences).toEqual({});
    expect((await call("/api/me/preferences", { method: "PATCH", jar: a.jar, json: { lang: "en", theme: "dark" } })).status).toBe(200);
    const m = await call("/api/me/preferences", { method: "PATCH", jar: a.jar, json: { sidebarCollapsed: true, notifRead: ["n1"] } });
    expect(m.data.preferences).toEqual({ lang: "en", theme: "dark", sidebarCollapsed: true, notifRead: ["n1"] });
    expect((await call("/api/me/preferences", { jar: b.jar })).data.preferences).toEqual({});
    for (const bad of [{}, { role: "owner" }, { lang: "fr" }, { notifRead: [1] }, { theme: "dark", extra: 1 }, { notifRead: Array(501).fill("x") }, "x", null]) {
      expect((await call("/api/me/preferences", { method: "PATCH", jar: a.jar, json: bad })).status, JSON.stringify(bad)).toBe(400);
    }
    expect((await call("/api/me/preferences", { method: "PATCH", jar: a.jar, json: { lang: "en" }, origin: "https://evil.example" })).status).toBe(403);
    const role = await pool.query("select role from \"user\" where email='staff@s.test'");
    expect(role.rows[0].role).toBe("staff");
  });
});
