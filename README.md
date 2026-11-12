# Sumeriapoto PayHub

Frontend statis (`public/`) + API Hono di Vercel Functions (`api/[...path].ts` -> `server/app.ts`) + Postgres.

## Role (RBAC, dicek di server)
| Role | Data | Pengeluaran | Kelola user |
|---|---|---|---|
| owner | baca/tulis semua | ya | semua role |
| admin | baca/tulis semua | ya | hanya staff & viewer |
| staff | customer, quotation, invoice (baca/tulis) | tidak | tidak |
| viewer | customer, quotation, invoice (baca) | tidak | tidak |

Register invite-only: owner/admin mengundang lewat menu **Users**, penerima menerima email berisi tautan untuk membuat password.
Matriks izin ada di `server/rbac.ts`.

## Setup lokal
```bash
npm install
cp .env.example .env.local        # isi DATABASE_URL & BETTER_AUTH_SECRET (openssl rand -base64 48)
npm run db:migrate
OWNER_EMAIL=kamu@email.com OWNER_PASSWORD='min-10-karakter' npm run seed:owner
npm run dev:api                   # http://localhost:3000 (API + file statis)
npm test                          # butuh Postgres; set TEST_DATABASE_URL (database ini DI-RESET oleh tes)
```

## Deploy ke Vercel
1. Tambah Postgres dari **Vercel Marketplace (Neon)** ke project; `DATABASE_URL` terisi otomatis (pakai connection string pooled).
2. Set env (`vercel env add`): `BETTER_AUTH_SECRET`, `APP_URL` (https://domain-kamu, tanpa slash akhir), `RESEND_API_KEY`, `EMAIL_FROM` (domain pengirim terverifikasi di Resend), `CRON_SECRET` (acak, >=16 karakter; Vercel Cron mengirimnya otomatis).
3. Jalankan migrasi sekali terhadap DB production: `DATABASE_URL=... npm run db:migrate`, lalu buat owner pertama: `DATABASE_URL=... BETTER_AUTH_SECRET=... APP_URL=... OWNER_EMAIL=... OWNER_PASSWORD=... npx tsx server/scripts/seed-owner.ts`.
4. `vercel --prod`.

Domain preview Vercel berbeda dari `APP_URL`; tambahkan ke `EXTRA_TRUSTED_ORIGINS` kalau mau login di preview.

## Keamanan yang sudah ada
Password di-hash (scrypt, Better Auth), sesi cookie httpOnly/Secure/SameSite=Lax, sign-up publik mati, token reset sekali pakai (1 jam) dan mencabut semua sesi, rate limit login/reset (disimpan di DB), respons lupa-password seragam (tidak membocorkan email terdaftar), cek Origin untuk request mutasi, validasi zod + batas body 4MB, CSP + header keamanan (`vercel.json`), SRI untuk library CDN, audit log (`audit_log`).

## API ringkas
| Endpoint | Fungsi |
|---|---|
| `POST /api/auth/sign-in/email`, `sign-out`, `request-password-reset`, `reset-password`, `change-password`, `update-user` | Auth (Better Auth) |
| `GET /api/me` | User + daftar permission |
| `GET /api/data/:key[?rev=]` | Semua record koleksi (`customers\|quotations\|invoices\|expenses`); `rev` untuk polling ringan |
| `POST /api/data/:key/sync` | Batch upsert/delete per record dengan versi (optimistic concurrency per record) |
| `GET/POST/PATCH /api/users`, `/api/users/invite`, `/:id/resend-invite` | Kelola user (owner/admin) |
| `GET /api/cron/cleanup` | Pembersihan harian (butuh `CRON_SECRET`) |

Sinkronisasi: frontend menyimpan state sebagai array, lalu mengirim hanya record yang berubah (diff terhadap snapshot server).
Dua user mengedit record berbeda tidak saling menimpa; record yang sama dengan versi basi ditolak, record diganti versi server, dan user diberi tahu.
Perubahan user lain terlihat dalam <=30 detik (atau saat tab kembali aktif).

## Batasan yang perlu diketahui
- Konflik pada record yang sama: edit user yang kalah dibuang (record diganti versi server). Belum ada merge per field.
- Record disimpan sebagai JSON utuh (bukan kolom per field), jadi belum bisa di-query/di-report langsung lewat SQL.
- Belum ada 2FA dan pembatasan akses per record (mis. staff hanya melihat customer miliknya).
- `payhub/` adalah scaffold Vite kosong yang belum dipakai.
- `PayHub-38.html` adalah salinan offline lama (pakai localStorage, tanpa login); tidak di-deploy.
