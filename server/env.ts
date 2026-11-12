import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi"),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET minimal 32 karakter"),
  // Origin publik aplikasi, tanpa trailing slash. Contoh: https://sumeria.vercel.app
  APP_URL: z.string().url(),
  // Opsional: tanpa RESEND_API_KEY, email hanya di-log ke console (dev).
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("PayHub <onboarding@resend.dev>"),
  // Origin tambahan yang boleh memanggil API (pisahkan koma), mis. domain preview.
  EXTRA_TRUSTED_ORIGINS: z.string().optional(),
  // Rahasia untuk endpoint cron pembersihan (Vercel Cron mengirimnya sebagai Bearer). Kosong = cron mati.
  CRON_SECRET: z.string().min(16).optional(),
});

export type Env = z.infer<typeof schema>;

let cached: Env | null = null;

export function env(): Env {
  if (!cached) {
    const parsed = schema.safeParse(process.env);
    if (!parsed.success) {
      const msg = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      throw new Error(`Konfigurasi environment tidak valid: ${msg}`);
    }
    cached = { ...parsed.data, APP_URL: parsed.data.APP_URL.replace(/\/+$/, "") };
  }
  return cached;
}

export const isProd = () => process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
