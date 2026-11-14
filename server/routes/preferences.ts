import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { db, schema } from "../db/client.js";
import { requireUser, type AppEnv } from "../middleware.js";

// Whitelist key: client tidak bisa menyimpan data bebas di sini. Semua field opsional (PATCH = merge).
export const prefsSchema = z
  .object({
    lang: z.enum(["id", "en"]),
    theme: z.enum(["light", "dark"]),
    sidebarCollapsed: z.boolean(),
    notifRead: z.array(z.string().min(1).max(128)).max(500),
  })
  .partial()
  .strict();

export const preferenceRoutes = new Hono<AppEnv>();
preferenceRoutes.use("*", requireUser);

preferenceRoutes.get("/", async (c) => {
  const row = await db().query.userPreferences.findFirst({ where: eq(schema.userPreferences.userId, c.get("user").id) });
  c.header("Cache-Control", "no-store");
  return c.json({ preferences: row?.data ?? {} });
});

preferenceRoutes.patch(
  "/",
  bodyLimit({ maxSize: 64 * 1024, onError: (c) => c.json({ error: "Data terlalu besar" }, 413) }),
  async (c) => {
    const parsed = prefsSchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success || Object.keys(parsed.data).length === 0) throw new HTTPException(400, { message: "Preferensi tidak valid" });
    const userId = c.get("user").id;
    const patch = parsed.data;
    // Merge atomik di sisi DB supaya dua tab yang menyimpan key berbeda tidak saling menimpa.
    const [row] = await db()
      .insert(schema.userPreferences)
      .values({ userId, data: patch })
      .onConflictDoUpdate({
        target: schema.userPreferences.userId,
        set: { data: sql`${schema.userPreferences.data} || ${JSON.stringify(patch)}::jsonb`, updatedAt: new Date() },
      })
      .returning({ data: schema.userPreferences.data });
    return c.json({ preferences: row?.data ?? patch });
  },
);
