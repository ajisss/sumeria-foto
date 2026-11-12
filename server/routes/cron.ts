import { timingSafeEqual } from "node:crypto";
import { lt } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { db, schema } from "../db/client.js";
import { env } from "../env.js";

export const cronRoutes = new Hono();

const AUDIT_RETENTION_DAYS = 180;

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// Dipanggil harian oleh Vercel Cron. Membuang data kedaluwarsa supaya tabel tidak membengkak.
cronRoutes.get("/cleanup", async (c) => {
  const secret = env().CRON_SECRET;
  if (!secret) throw new HTTPException(404, { message: "Tidak ditemukan" });
  const given = (c.req.header("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!safeEqual(given, secret)) throw new HTTPException(401, { message: "Unauthorized" });

  const now = new Date();
  const d = db();
  const sessions = await d.delete(schema.session).where(lt(schema.session.expiresAt, now)).returning({ id: schema.session.id });
  const verifications = await d.delete(schema.verification).where(lt(schema.verification.expiresAt, now)).returning({ id: schema.verification.id });
  const rate = await d.delete(schema.rateLimit).where(lt(schema.rateLimit.lastRequest, Date.now() - 24 * 3600_000)).returning({ id: schema.rateLimit.id });
  const audit = await d
    .delete(schema.auditLog)
    .where(lt(schema.auditLog.createdAt, new Date(Date.now() - AUDIT_RETENTION_DAYS * 86400_000)))
    .returning({ id: schema.auditLog.id });
  return c.json({ sessions: sessions.length, verifications: verifications.length, rateLimits: rate.length, auditLogs: audit.length });
});
