import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { auth } from "./auth.js";
import { env } from "./env.js";
import { can, isRole, type Permission, type Role } from "./rbac.js";

export type AuthUser = { id: string; email: string; name: string; role: Role };
export type AppEnv = { Variables: { user: AuthUser } };

const UNSAFE = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function trustedOrigins() {
  const e = env();
  return new Set([e.APP_URL, ...(e.EXTRA_TRUSTED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean)]);
}

/** Tolak request mutasi lintas-origin (CSRF) dan body non-JSON. */
export const originGuard: MiddlewareHandler = async (c, next) => {
  if (UNSAFE.has(c.req.method)) {
    const origin = c.req.header("origin");
    if (origin && !trustedOrigins().has(origin)) throw new HTTPException(403, { message: "Origin tidak diizinkan" });
    if (!origin && c.req.header("sec-fetch-site") === "cross-site") throw new HTTPException(403, { message: "Origin tidak diizinkan" });
    const len = c.req.header("content-length");
    if (len && len !== "0" && !(c.req.header("content-type") ?? "").toLowerCase().startsWith("application/json")) {
      throw new HTTPException(415, { message: "Content-Type harus application/json" });
    }
  }
  await next();
};

export const requireUser: MiddlewareHandler<AppEnv> = async (c, next) => {
  const s = await auth().api.getSession({ headers: c.req.raw.headers });
  if (!s) throw new HTTPException(401, { message: "Belum login" });
  const u = s.user as typeof s.user & { role?: unknown; banned?: unknown };
  if (u.banned) throw new HTTPException(403, { message: "Akun dinonaktifkan" });
  if (!isRole(u.role)) throw new HTTPException(403, { message: "Role tidak valid" });
  c.set("user", { id: u.id, email: u.email, name: u.name, role: u.role });
  await next();
};

export const requirePermission =
  (perm: Permission): MiddlewareHandler<AppEnv> =>
  async (c, next) => {
    if (!can(c.get("user").role, perm)) throw new HTTPException(403, { message: "Tidak punya akses" });
    await next();
  };
