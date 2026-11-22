import { and, asc, eq, ne } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { audit } from "../audit.js";
import { auth } from "../auth.js";
import { db, schema } from "../db/client.js";
import { requirePermission, requireUser, type AppEnv } from "../middleware.js";
import { canManageRole, isRole, ROLES, type Role } from "../rbac.js";

export const userRoutes = new Hono<AppEnv>();
userRoutes.use("*", requireUser, requirePermission("users:manage"));

const publicUser = {
  id: schema.user.id,
  name: schema.user.name,
  email: schema.user.email,
  role: schema.user.role,
  banned: schema.user.banned,
  createdAt: schema.user.createdAt,
};

userRoutes.get("/", async (c) => {
  const rows = await db().select(publicUser).from(schema.user).orderBy(asc(schema.user.createdAt));
  c.header("Cache-Control", "no-store");
  return c.json({ users: rows });
});

const passwordField = z.string().min(10, "Password minimal 10 karakter").max(128);

const createBody = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  name: z.string().trim().min(1).max(100),
  role: z.enum(ROLES),
  password: passwordField,
});

// Akun dibuat langsung oleh owner dengan credential (tanpa email undangan). Password hanya dikenal
// owner/penerima; di DB hanya hash. Penerima bisa menggantinya sendiri lewat menu Profile.
userRoutes.post("/", async (c) => {
  const actor = c.get("user");
  const parsed = createBody.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) throw new HTTPException(400, { message: parsed.error.issues[0]?.message ?? "Data akun tidak valid" });
  const { email, name, role, password } = parsed.data;
  if (!canManageRole(actor.role, role)) throw new HTTPException(403, { message: "Tidak boleh memberi role ini" });

  const existing = await db().query.user.findFirst({ where: eq(schema.user.email, email) });
  if (existing) throw new HTTPException(409, { message: "Email sudah terdaftar" });

  const ctx = await auth().$context;
  const created = await ctx.internalAdapter.createUser({ email, name, role, banned: false, emailVerified: true }, { method: "admin" });
  await ctx.internalAdapter.createAccount({
    userId: created.id,
    providerId: "credential",
    accountId: created.id,
    password: await ctx.password.hash(password),
  });
  await audit(actor.id, "user.create", created.id, { email, role });
  return c.json({ id: created.id }, 201);
});

const resetBody = z.object({ password: passwordField });

userRoutes.post("/:id/reset-password", async (c) => {
  const actor = c.get("user");
  const target = await db().query.user.findFirst({ where: eq(schema.user.id, c.req.param("id")) });
  if (!target || !isRole(target.role)) throw new HTTPException(404, { message: "User tidak ditemukan" });
  if (!canManageRole(actor.role, target.role)) throw new HTTPException(403, { message: "Tidak punya akses" });
  const parsed = resetBody.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) throw new HTTPException(400, { message: parsed.error.issues[0]?.message ?? "Password tidak valid" });
  const ctx = await auth().$context;
  await ctx.internalAdapter.updatePassword(target.id, await ctx.password.hash(parsed.data.password));
  await ctx.internalAdapter.deleteUserSessions(target.id); // paksa login ulang dengan password baru
  await audit(actor.id, "user.reset_password", target.id);
  return c.json({ ok: true });
});

const patchBody = z
  .object({ role: z.enum(ROLES).optional(), banned: z.boolean().optional(), name: z.string().trim().min(1).max(100).optional() })
  .refine((v) => Object.keys(v).length > 0, "Tidak ada perubahan");

userRoutes.patch("/:id", async (c) => {
  const actor = c.get("user");
  const id = c.req.param("id");
  const parsed = patchBody.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) throw new HTTPException(400, { message: "Data tidak valid" });
  const patch = parsed.data;

  const target = await db().query.user.findFirst({ where: eq(schema.user.id, id) });
  if (!target || !isRole(target.role)) throw new HTTPException(404, { message: "User tidak ditemukan" });

  if (id === actor.id && (patch.role !== undefined || patch.banned !== undefined)) {
    throw new HTTPException(400, { message: "Tidak bisa mengubah role/status akun sendiri" });
  }
  if (!canManageRole(actor.role, target.role)) throw new HTTPException(403, { message: "Tidak punya akses ke user ini" });
  if (patch.role !== undefined && !canManageRole(actor.role, patch.role as Role)) {
    throw new HTTPException(403, { message: "Tidak boleh memberi role ini" });
  }

  // Pastikan selalu ada minimal satu owner aktif.
  const losesOwner = target.role === "owner" && ((patch.role !== undefined && patch.role !== "owner") || patch.banned === true);
  if (losesOwner) {
    const others = await db()
      .select({ id: schema.user.id })
      .from(schema.user)
      .where(and(eq(schema.user.role, "owner"), eq(schema.user.banned, false), ne(schema.user.id, id)))
      .limit(1);
    if (others.length === 0) throw new HTTPException(409, { message: "Harus ada minimal satu owner aktif" });
  }

  await db().update(schema.user).set({ ...patch, updatedAt: new Date() }).where(eq(schema.user.id, id));
  if (patch.banned === true || (patch.role !== undefined && patch.role !== target.role)) {
    // Cabut sesi supaya perubahan role/status langsung berlaku.
    await (await auth().$context).internalAdapter.deleteUserSessions(id);
  }
  await audit(actor.id, "user.update", id, patch);
  return c.json({ ok: true });
});
