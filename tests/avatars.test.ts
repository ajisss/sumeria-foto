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
  await call("/api/auth/sign-in/email", { method: "POST", json: { email, password: PW }, jar, headers: { "x-forwarded-for": `10.8.0.${(ipSeq++ % 250) + 1}` } });
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
  process.env.BETTER_AUTH_SECRET = "q".repeat(40);
  process.env.APP_URL = ORIGIN;
  delete process.env.RESEND_API_KEY;
  const { getPool } = await import("../server/db/client.js");
  pool = getPool();
  await pool.query("drop schema if exists drizzle cascade; drop schema public cascade; create schema public;");
  await (await import("drizzle-orm/node-postgres/migrator")).migrate((await import("../server/db/client.js")).db(), { migrationsFolder: "drizzle" });
  app = (await import("../server/app.js")).app;
  for (const [e, r] of [["a", "admin"], ["b", "viewer"]] as const) await seedUser(`${e}@v.test`, r);
});
afterAll(async () => { await pool?.end(); });

const PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
const JPG = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
const b64 = (s: string) => Buffer.from(s).toString("base64");
const put = (jar: Jar, image: unknown, extra: object = {}) => call("/api/me/avatar", { method: "PUT", jar, json: { image }, ...extra });

describe("foto profil", () => {
  it("butuh login", async () => {
    expect((await call("/api/me/avatar", { method: "PUT", json: { image: "data:image/png;base64," + PNG } })).status).toBe(401);
    expect((await call("/api/me/avatar", { method: "DELETE" })).status).toBe(401);
    expect((await call("/api/avatars/xyz")).status).toBe(401);
  });

  it("upload PNG/JPEG: tersimpan, tampil di /api/me, disajikan dengan header aman, terisolasi antar user", async () => {
    const a = await login("a@v.test");
    const b = await login("b@v.test");
    const r = await put(a, "data:image/png;base64," + PNG);
    expect(r.status, JSON.stringify(r.data)).toBe(200);
    const me = await call("/api/me", { jar: a });
    expect(me.data.user.image).toBe(r.data.image);
    expect(me.data.user.image).toMatch(/^\/api\/avatars\/[\w-]+\?v=\d+$/);
    const get = await call(r.data.image.split("?")[0], { jar: a });
    expect(get.status).toBe(200);
    expect(get.res.headers.get("content-type")).toBe("image/png");
    expect(get.res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(get.res.headers.get("content-security-policy")).toContain("sandbox");
    // user lain yang login boleh melihat, tapi miliknya sendiri tetap kosong
    expect((await call(r.data.image.split("?")[0], { jar: b })).status).toBe(200);
    expect((await call("/api/me", { jar: b })).data.user.image).toBeNull();
    // ganti ke JPEG
    expect((await put(a, "data:image/jpeg;base64," + JPG)).status).toBe(200);
    expect((await call(r.data.image.split("?")[0], { jar: a })).res.headers.get("content-type")).toBe("image/jpeg");
  });

  it("ETag: request ulang dengan If-None-Match -> 304", async () => {
    const a = await login("a@v.test");
    const url = (await call("/api/me", { jar: a })).data.user.image.split("?")[0];
    const first = await call(url, { jar: a });
    const etag = first.res.headers.get("etag")!;
    expect(etag).toBeTruthy();
    expect((await call(url, { jar: a, headers: { "if-none-match": etag } })).status).toBe(304);
  });

  it("menolak SVG, GIF, isi bukan gambar, label tipe palsu, string bebas, dan file terlalu besar", async () => {
    const a = await login("a@v.test");
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
    const cases: [string, unknown, number][] = [
      ["svg", "data:image/svg+xml;base64," + b64(svg), 400],
      ["gif", "data:image/gif;base64,R0lGODlhAQABAAAAACw=", 400],
      ["html berlabel png", "data:image/png;base64," + b64("<html><script>alert(1)</script></html>"), 400],
      ["svg berlabel jpeg", "data:image/jpeg;base64," + b64(svg), 400],
      ["url eksternal", "https://evil.example/x.png", 400],
      ["javascript url", "javascript:alert(1)", 400],
      ["bukan string", { a: 1 }, 400],
      ["kosong", "", 400],
      ["base64 rusak", "data:image/png;base64,@@@@", 400],
    ];
    for (const [n, img, st] of cases) expect((await put(a, img)).status, n).toBe(st);
    const big = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(300 * 1024, 1)]).toString("base64");
    expect((await put(a, "data:image/jpeg;base64," + big)).status).toBe(413);
    expect((await call("/api/me/avatar", { method: "PUT", jar: a, body: "bukan json", headers: { "content-type": "text/plain", "content-length": "10" } })).status).toBe(415);
  });

  it("origin asing ditolak (CSRF)", async () => {
    const a = await login("a@v.test");
    expect((await put(a, "data:image/png;base64," + PNG, { origin: "https://evil.example" })).status).toBe(403);
    expect((await call("/api/me/avatar", { method: "DELETE", jar: a, origin: "https://evil.example" })).status).toBe(403);
  });

  it("update-user Better Auth tidak bisa mengisi image dengan URL bebas, tapi ganti nama tetap jalan", async () => {
    const b = await login("b@v.test");
    const bad = await call("/api/auth/update-user", { method: "POST", jar: b, json: { name: "Dilarang", image: "https://evil.example/track.png" } });
    expect(bad.status).toBe(400);
    expect((await pool.query("select image from \"user\" where email='b@v.test'")).rows[0].image).toBeNull();
    const r = await call("/api/auth/update-user", { method: "POST", jar: b, json: { name: "Nama Baru" } });
    expect(r.status).toBe(200);
    const row = (await pool.query("select name, image from \"user\" where email='b@v.test'")).rows[0];
    expect(row.name).toBe("Nama Baru");
    expect(row.image).toBeNull();
  });

  it("hapus foto: image null dan gambar tidak bisa diambil lagi", async () => {
    const a = await login("a@v.test");
    const url = (await call("/api/me", { jar: a })).data.user.image.split("?")[0];
    expect((await call("/api/me/avatar", { method: "DELETE", jar: a })).status).toBe(200);
    expect((await call("/api/me", { jar: a })).data.user.image).toBeNull();
    expect((await call(url, { jar: a })).status).toBe(404);
  });
});
