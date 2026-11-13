import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { secureHeaders } from "hono/secure-headers";
import { auth } from "./auth.js";
import { originGuard, requireUser, type AppEnv } from "./middleware.js";
import { permissionsOf } from "./rbac.js";
import { analyticsRoutes } from "./routes/analytics.js";
import { cronRoutes } from "./routes/cron.js";
import { dataRoutes } from "./routes/data.js";
import { userRoutes } from "./routes/users.js";

export const app = new Hono<AppEnv>();

app.use("*", secureHeaders({
  strictTransportSecurity: "max-age=63072000; includeSubDomains",
  referrerPolicy: "strict-origin-when-cross-origin",
  xFrameOptions: "DENY",
}));
app.use("/api/*", originGuard);

app.get("/api/health", (c) => c.json({ ok: true }));

// Endpoint auth (sign-in, sign-out, get-session, request-password-reset, reset-password) oleh Better Auth.
app.on(["GET", "POST"], "/api/auth/*", (c) => auth().handler(c.req.raw));

app.get("/api/me", requireUser, (c) => {
  const u = c.get("user");
  c.header("Cache-Control", "no-store");
  return c.json({ user: u, permissions: permissionsOf(u.role) });
});

app.route("/api/data", dataRoutes);
app.route("/api/analytics", analyticsRoutes);
app.route("/api/users", userRoutes);
app.route("/api/cron", cronRoutes);

app.notFound((c) => c.json({ error: "Tidak ditemukan" }, 404));
app.onError((err, c) => {
  if (err instanceof HTTPException) return c.json({ error: err.message }, err.status);
  console.error("[api] error:", err);
  return c.json({ error: "Terjadi kesalahan pada server" }, 500);
});
