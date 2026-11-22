import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { audit } from "../audit.js";
import { db, schema } from "../db/client.js";
import { requireUser, type AppEnv } from "../middleware.js";

const MAX_BYTES = 256 * 1024; // klien memperkecil ke ~256px JPEG (puluhan KB); ini batas keras di server

const body = z.object({ image: z.string().max(MAX_BYTES * 2) });

/** Tipe gambar dikenali dari magic bytes, bukan dari klaim klien. SVG sengaja tidak diterima (bisa memuat script). */
function sniff(buf: Buffer): "image/jpeg" | "image/png" | "image/webp" | null {
  if (buf.length > 12 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.length > 12 && buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  return null;
}

/** Ubah foto sendiri. Hanya diri sendiri; tidak ada endpoint untuk mengubah foto user lain. */
export const avatarMeRoutes = new Hono<AppEnv>();
avatarMeRoutes.use("*", requireUser);

avatarMeRoutes.put(
  "/",
  bodyLimit({ maxSize: MAX_BYTES * 2 + 1024, onError: (c) => c.json({ error: "Foto terlalu besar" }, 413) }),
  async (c) => {
    const actor = c.get("user");
    const parsed = body.safeParse(await c.req.json().catch(() => null));
    const m = parsed.success ? /^data:image\/(?:jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(parsed.data.image) : null;
    if (!m) throw new HTTPException(400, { message: "Format foto tidak valid (JPEG, PNG, atau WebP)" });
    const buf = Buffer.from(m[1]!, "base64");
    if (buf.length > MAX_BYTES) throw new HTTPException(413, { message: "Foto terlalu besar (maks 256KB setelah diperkecil)" });
    const mime = sniff(buf);
    if (!mime) throw new HTTPException(400, { message: "Isi file bukan gambar JPEG, PNG, atau WebP" });

    const now = new Date();
    await db().transaction(async (tx) => {
      await tx
        .insert(schema.userAvatars)
        .values({ userId: actor.id, mime, data: buf, updatedAt: now })
        .onConflictDoUpdate({ target: schema.userAvatars.userId, set: { mime, data: buf, updatedAt: now } });
      await tx.update(schema.user).set({ image: `/api/avatars/${actor.id}?v=${now.getTime()}`, updatedAt: now }).where(eq(schema.user.id, actor.id));
    });
    await audit(actor.id, "avatar.set", actor.id, { bytes: buf.length, mime });
    return c.json({ image: `/api/avatars/${actor.id}?v=${now.getTime()}` });
  },
);

avatarMeRoutes.delete("/", async (c) => {
  const actor = c.get("user");
  await db().transaction(async (tx) => {
    await tx.delete(schema.userAvatars).where(eq(schema.userAvatars.userId, actor.id));
    await tx.update(schema.user).set({ image: null, updatedAt: new Date() }).where(eq(schema.user.id, actor.id));
  });
  await audit(actor.id, "avatar.delete", actor.id);
  return c.json({ image: null });
});

/** Ambil foto (wajib login, semua role). */
export const avatarRoutes = new Hono<AppEnv>();
avatarRoutes.use("*", requireUser);
avatarRoutes.get("/:userId", async (c) => {
  const row = await db().query.userAvatars.findFirst({ where: eq(schema.userAvatars.userId, c.req.param("userId")) });
  if (!row) throw new HTTPException(404, { message: "Tidak ditemukan" });
  const etag = `"${row.updatedAt.getTime()}"`;
  if (c.req.header("if-none-match") === etag) return c.body(null, 304);
  return c.body(new Uint8Array(row.data), 200, {
    "Content-Type": row.mime,
    "Content-Disposition": "inline",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; sandbox",
    "Cache-Control": "private, max-age=3600",
    ETag: etag,
  });
});
