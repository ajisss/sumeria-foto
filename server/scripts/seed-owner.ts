import { eq } from "drizzle-orm";
import { auth } from "../auth.js";
import { db, getPool, schema } from "../db/client.js";

const email = process.env.OWNER_EMAIL?.trim().toLowerCase();
const password = process.env.OWNER_PASSWORD;
const name = process.env.OWNER_NAME?.trim() || "Owner";
if (!email || !password) throw new Error("Set OWNER_EMAIL dan OWNER_PASSWORD");
if (password.length < 10) throw new Error("OWNER_PASSWORD minimal 10 karakter");

const ctx = await auth().$context;
const existing = await db().query.user.findFirst({ where: eq(schema.user.email, email) });
if (existing) {
  console.log("User sudah ada, tidak ada yang diubah.");
} else {
  const user = await ctx.internalAdapter.createUser({ email, name, role: "owner", banned: false, emailVerified: true }, { method: "admin" });
  await ctx.internalAdapter.createAccount({
    userId: user.id, providerId: "credential", accountId: user.id, password: await ctx.password.hash(password),
  });
  console.log(`Owner dibuat: ${email}`);
}
await getPool().end();
