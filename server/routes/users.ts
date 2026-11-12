import { randomBytes } from "node:crypto";
import { and, asc, eq, ne } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { audit } from "../audit.js";
import { auth } from "../auth.js";
import { db, schema } from "../db/client.js";
import { sendInviteEmail } from "../email.js";
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

const inviteBody = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  name: z.string().trim().min(1).max(100),
  role: z.enum(ROLES),
});

async function issueSetupToken(userId: string) {
  const ctx = await auth().$context;
  const token = randomBytes(24).toString("base64url");
  await ctx.internalAdapter.createVerificationValue({
    value: userId,
    identifier: `reset-password:${token}`,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });
  return token;
}

userRoutes.post("/invite", async (c) => {
  const actor = c.get("user");
  const parsed = inviteBody.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) throw new HTTPException(400, { message: "Data undangan tidak valid" });
  const { email, name, role } = parsed.data;
  if (!canManageRole(actor.role, role)) throw new HTTPException(403, { message: "Tidak boleh memberi role ini" });

  const existing = await db().query.user.findFirst({ where: eq(schema.user.email, email) });
  if (existing) throw new HTTPException(409, { message: "Email sudah terdaftar" });

  const ctx = await auth().$context;
  const created = await ctx.internalAdapter.createUser({ email, name, role, banned: false, emailVerified: false }, { method: "admin" });
  const token = await issueSetupToken(created.id);
  await sendInviteEmail(email, name, token, actor.name || actor.email);
  await audit(actor.id, "user.invite", created.id, { email, role });
  return c.json({ id: created.id }, 201);
});

userRoutes.post("/:id/resend-invite", async (c) => {
  const actor = c.get("user");
  const target = await db().query.user.findFirst({ where: eq(schema.user.id, c.req.param("id")) });
  if (!target || !isRole(target.role)) throw new HTTPException(404, { message: "User tidak ditemukan" });
  if (!canManageRole(actor.role, target.role)) throw new HTTPException(403, { message: "Tidak punya akses" });
  if (target.banned) throw new HTTPException(409, { message: "Akun dinonaktifkan" });
  const token = await issueSetupToken(target.id);
  await sendInviteEmail(target.email, target.name, token, actor.name || actor.email);
  await audit(actor.id, "user.resend_invite", target.id);
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
