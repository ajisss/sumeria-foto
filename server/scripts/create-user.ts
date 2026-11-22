/**
 * Buat akun dengan credential (tanpa email undangan), sama seperti menu Pengguna > Buat akun.
 *
 *   USER_EMAIL=admin1@contoh.com USER_NAME="Admin 1" USER_ROLE=admin USER_PASSWORD='...' npm run create:user
 *
 * Jika email sudah ada, tidak diubah (tambahkan --reset-password untuk mengganti password-nya).
 */
import { eq } from "drizzle-orm";
import { auth } from "../auth.js";
import { db, getPool, schema } from "../db/client.js";
import { isRole } from "../rbac.js";

const email = process.env.USER_EMAIL?.trim().toLowerCase();
const password = process.env.USER_PASSWORD;
const name = process.env.USER_NAME?.trim();
const role = process.env.USER_ROLE;
if (!email || !password || !name || !isRole(role)) throw new Error("Set USER_EMAIL, USER_NAME, USER_PASSWORD, USER_ROLE (owner|admin|staff|viewer)");
if (password.length < 10) throw new Error("USER_PASSWORD minimal 10 karakter");

const ctx = await auth().$context;
const existing = await db().query.user.findFirst({ where: eq(schema.user.email, email) });
if (existing) {
  if (process.argv.includes("--reset-password")) {
    await ctx.internalAdapter.updatePassword(existing.id, await ctx.password.hash(password));
    await ctx.internalAdapter.deleteUserSessions(existing.id);
    console.log(`Password direset: ${email}`);
  } else {
    console.log(`User sudah ada: ${email} (tidak diubah)`);
  }
} else {
  const user = await ctx.internalAdapter.createUser({ email, name, role, banned: false, emailVerified: true }, { method: "admin" });
  await ctx.internalAdapter.createAccount({ userId: user.id, providerId: "credential", accountId: user.id, password: await ctx.password.hash(password) });
  console.log(`Akun dibuat: ${email} (${role})`);
}
await getPool().end();
