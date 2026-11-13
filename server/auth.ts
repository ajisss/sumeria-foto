import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { db, schema } from "./db/client.js";
import { env, isProd } from "./env.js";
import { sendResetPasswordEmail } from "./email.js";

function make() {
  const e = env();
  const extra = (e.EXTRA_TRUSTED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return betterAuth({
    appName: "PayHub",
    baseURL: e.APP_URL,
    basePath: "/api/auth",
    secret: e.BETTER_AUTH_SECRET,
    trustedOrigins: [e.APP_URL, ...extra],
    database: drizzleAdapter(db(), {
      provider: "pg",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
        rateLimit: schema.rateLimit,
      },
    }),
    emailAndPassword: {
      enabled: true,
      // Invite-only: akun dibuat owner/admin lewat /api/users/invite, bukan sign-up publik.
      disableSignUp: true,
      minPasswordLength: 10,
      maxPasswordLength: 128,
      resetPasswordTokenExpiresIn: 60 * 60,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, token }) => {
        // Jangan di-await di jalur response supaya waktu respons tidak membocorkan apakah email terdaftar.
        void sendResetPasswordEmail(user.email, token).catch((err) =>
          console.error("[auth] gagal kirim email reset:", err instanceof Error ? err.message : err),
        );
      },
    },
    user: {
      additionalFields: {
        // input:false => tidak bisa diisi/diubah dari client lewat endpoint Better Auth.
        role: { type: "string", required: true, defaultValue: "viewer", input: false },
        banned: { type: "boolean", required: true, defaultValue: false, input: false },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    advanced: {
      useSecureCookies: isProd(),
      defaultCookieAttributes: { httpOnly: true, sameSite: "lax", secure: isProd() },
      ipAddress: { ipAddressHeaders: ["x-vercel-forwarded-for", "x-forwarded-for"] },
    },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 100,
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
        "/request-password-reset": { window: 300, max: 3 },
        "/reset-password": { window: 300, max: 5 },
      },
    },
    databaseHooks: {
      session: {
        create: {
          before: async (session) => {
            const rows = await db().query.user.findFirst({ where: (u, { eq }) => eq(u.id, session.userId) });
            if (!rows || rows.banned) {
              throw new APIError("FORBIDDEN", { message: "Akun dinonaktifkan." });
            }
            return { data: session };
          },
        },
      },
    },
  });
}

let instance: ReturnType<typeof make> | null = null;
export function auth() {
  return (instance ??= make());
}
export type Auth = ReturnType<typeof auth>;
