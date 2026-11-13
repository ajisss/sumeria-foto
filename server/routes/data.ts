import { and, asc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { audit } from "../audit.js";
import { db, schema } from "../db/client.js";
import { requireUser, type AppEnv } from "../middleware.js";
import { can, isCollection } from "../rbac.js";

const MAX_CHANGES = 500;
const MAX_RECORD_BYTES = 256 * 1024;

const change = z.discriminatedUnion("op", [
  z.object({
    op: z.literal("upsert"),
    id: z.string().min(1).max(128),
    // 0 = record baru; >0 = versi record yang diedit klien.
    version: z.number().int().min(0),
    data: z.record(z.string(), z.unknown()),
  }),
  z.object({ op: z.literal("delete"), id: z.string().min(1).max(128), version: z.number().int().min(1) }),
]);
const syncBody = z.object({ changes: z.array(change).min(1).max(MAX_CHANGES) });

export const dataRoutes = new Hono<AppEnv>();
dataRoutes.use("*", requireUser);

function keyOf(raw: string) {
  if (!isCollection(raw)) throw new HTTPException(404, { message: "Koleksi tidak ditemukan" });
  return raw;
}

const R = schema.records;

async function revOf(key: string) {
  const [row] = await db()
    .select({ n: sql<number>`count(*)::int`, m: sql<string>`coalesce(max(${R.updatedAt})::text, '')` })
    .from(R)
    .where(eq(R.collection, key));
  return `${row?.n ?? 0}:${row?.m ?? ""}`;
}

// Baca seluruh koleksi. `?rev=` dipakai polling: bila tidak berubah, balas ringan.
dataRoutes.get("/:key", async (c) => {
  const key = keyOf(c.req.param("key"));
  if (!can(c.get("user").role, `read:${key}`)) throw new HTTPException(403, { message: "Tidak punya akses" });
  c.header("Cache-Control", "no-store");
  const rev = await revOf(key);
  if (c.req.query("rev") === rev) return c.json({ unchanged: true, rev });
  const rows = await db()
    .select({ id: R.id, version: R.version, data: R.data })
    .from(R)
    .where(eq(R.collection, key))
    .orderBy(asc(R.seq));
  return c.json({ rev, records: rows });
});

type Result = { id: string; ok: boolean; version?: number; conflict?: boolean };

dataRoutes.post(
  "/:key/sync",
  bodyLimit({ maxSize: 4 * 1024 * 1024, onError: (c) => c.json({ error: "Data terlalu besar (maks 4MB)" }, 413) }),
  async (c) => {
    const key = keyOf(c.req.param("key"));
    const user = c.get("user");
    if (!can(user.role, `write:${key}`)) throw new HTTPException(403, { message: "Tidak punya akses" });

    const parsed = syncBody.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) throw new HTTPException(400, { message: "Format data tidak valid" });
    const { changes } = parsed.data;

    for (const ch of changes) {
      if (ch.op === "upsert" && Buffer.byteLength(JSON.stringify(ch.data)) > MAX_RECORD_BYTES) {
        throw new HTTPException(413, { message: "Satu record terlalu besar (maks 256KB)" });
      }
    }
    if (new Set(changes.map((x) => x.id)).size !== changes.length) {
      throw new HTTPException(400, { message: "Perubahan ganda untuk id yang sama" });
    }

    const results: Result[] = [];
    await db().transaction(async (tx) => {
      for (const ch of changes) {
        const where = and(eq(R.collection, key), eq(R.id, ch.id), eq(R.version, ch.version));
        if (ch.op === "delete") {
          const del = await tx.delete(R).where(where).returning({ id: R.id });
          if (del.length) {
            results.push({ id: ch.id, ok: true });
            continue;
          }
          // Sudah terhapus = idempoten (ok); masih ada tapi versi beda = konflik.
          const still = await tx.select({ v: R.version }).from(R).where(and(eq(R.collection, key), eq(R.id, ch.id)));
          results.push(still.length ? { id: ch.id, ok: false, conflict: true } : { id: ch.id, ok: true });
        } else if (ch.version === 0) {
          const ins = await tx
            .insert(R)
            .values({ collection: key, id: ch.id, data: ch.data, version: 1, createdBy: user.id, updatedBy: user.id })
            .onConflictDoNothing()
            .returning({ version: R.version });
          results.push(ins[0] ? { id: ch.id, ok: true, version: ins[0].version } : { id: ch.id, ok: false, conflict: true });
        } else {
          const upd = await tx
            .update(R)
            .set({ data: ch.data, version: sql`${R.version} + 1`, updatedBy: user.id, updatedAt: new Date() })
            .where(where)
            .returning({ version: R.version });
          results.push(upd[0] ? { id: ch.id, ok: true, version: upd[0].version } : { id: ch.id, ok: false, conflict: true });
        }
      }
    });

    const okCount = results.filter((r) => r.ok).length;
    if (okCount) await audit(user.id, "data.sync", key, { changes: okCount, conflicts: results.length - okCount });
    return c.json({ results, rev: await revOf(key) });
  },
);
