import { db, schema } from "./db/client.js";

export async function audit(userId: string | null, action: string, target?: string, meta?: Record<string, unknown>) {
  try {
    await db().insert(schema.auditLog).values({ userId, action, target: target ?? null, meta: meta ?? null });
  } catch (err) {
    console.error("[audit] gagal menulis:", err instanceof Error ? err.message : err);
  }
}
