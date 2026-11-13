# PayHub rebuild — porting guide (untuk agent)

Aplikasi lama: satu file HTML minified. Versi rapi (prettified) ada di `../legacy/app.pretty.js` (±9100 baris). Tugas: port ke
Vite + React 19 + TypeScript + Tailwind v4 + **shadcn/ui (radix)** + **lucide-react**. Perilaku & format data HARUS sama dengan
versi lama (data lama di localStorage `payhub::payhub_*` harus tetap terbaca).

## Yang sudah ada (jangan diubah, cukup dipakai)
- `src/lib/types.ts`, `constants.ts`, `format.ts` (fmtRp, fmtDate, uid, todayStr, monthKey, monthLabel...), `calc.ts`
  (lineTotal, docSubtotal, nextNumber, generatePayments, paidAmount, currentStatus, isFullyPaid, computeOverdueInvoices,
  reminderMessage, openWhatsApp, sortRows), `storage.ts`, `app-context.tsx` (`useApp()` → customers, quotations, invoices,
  expenses + setter, tab/setTab, selectedInvoiceId, detailCustomerId, setPrintTarget, overdueInvoices, markBackupDone).
- `src/i18n`: `useT()` → `t('key', {param})`, `useI18n()` → `{lang, setLang, t}`. Placeholder pakai `{nama}`.
- `src/components/app/*`: PageHeader, ConfirmDialog (pengganti confirm), CurrencyInput, SearchInput, SortableHead (+`SortState`),
  StatCard, EmptyState, StatusBadge. `src/components/ui/*`: komponen shadcn (button, input, select, dialog, alert-dialog,
  sheet, table, tabs, card, badge, calendar, popover, command, checkbox, switch, radio-group, field, input-group, chart,
  sonner, dropdown-menu, tooltip, scroll-area, skeleton, separator, avatar, label, textarea, sidebar).
- Shell (`src/App.tsx`) sudah merender halaman via `src/pages/<nama>.tsx` (`export default function XPage()`), memakai `useApp()`.

## Aturan wajib
1. **Hanya shadcn/ui + lucide-react.** Tidak ada `style={{...}}`, tidak ada warna hex/rgb, tidak ada `<button>/<input>/<select>/<table>`
   mentah kalau ada padanan shadcn. Warna lewat token Tailwind (`bg-background`, `text-muted-foreground`, `border`, `text-destructive`, dst.).
   Kalau butuh komponen shadcn yang belum ada: `npx shadcn@latest add -y <nama>` (boleh, tapi jangan `npm install` paket lain tanpa alasan kuat).
2. **Font**: tidak set font-family apa pun; Inter (opsz) sudah global.
3. **Modal/alert**: `Dialog`/`Sheet` untuk form, `ConfirmDialog` untuk konfirmasi, `toast` dari `sonner` untuk notifikasi.
   Dilarang `window.alert/confirm/prompt`.
4. **i18n**: setiap teks yang terlihat user (label, placeholder, judul, tooltip, aria-label, toast, pesan error) lewat `t()`.
   Tidak boleh ada string campur bahasa. Kunci baru ditulis ke **file extra milik areamu saja** (`src/i18n/extra/<area>.ts`):
   isi `id` (as const) dan `en` (tipe `Record<keyof typeof id,string>` → parity dijaga compiler). Pakai ulang kunci lama di
   `src/i18n/id.ts` kalau sudah ada (jangan edit `id.ts`/`en.ts`). Nama kunci baru diawali prefix areamu supaya tidak bentrok.
   Terjemahan harus alami & benar (Indonesia baku-santai, English natural); jangan copy teks ID ke EN.
   Locale format tanggal/angka mengikuti `lang` (`fmtDate(d, lang)`); mata uang tetap `fmtRp`.
5. **Aksesibilitas**: label untuk setiap input (`Field`/`FieldLabel`), `aria-label` untuk tombol ikon, fokus keyboard jalan,
   tabel pakai `Table` shadcn dengan header semantik.
6. **Responsif**: harus nyaman di mobile (tabel boleh scroll horizontal di dalam `overflow-x-auto`).
7. Logika bisnis: pakai helper di `lib/calc.ts`; jangan duplikasi. Kalau ada bug nyata di logika lama, perbaiki dan catat di laporan.
8. ID baru pakai `uid()`. Jangan ubah bentuk data (field names) — data lama harus tetap kompatibel.
9. TypeScript strict: tidak ada `any`, tidak ada `@ts-ignore`.
10. Hanya edit file milikmu (lihat tugasmu). Verifikasi: `npx tsc -p tsconfig.app.json --noEmit` dan `npx vite build` harus lolos
    (error dari file milik agent lain yang sedang dikerjakan boleh diabaikan, tapi laporkan).

## Kontrak antar area
- Print/PDF/WhatsApp (area **print**): `src/components/print-view.tsx` → `PrintView({target:{type,id,autoPrint?}, onClose})`;
  `src/lib/pdf.ts` → `downloadInvoicePdf(inv, lang)`, `downloadQuotationPdf(q, lang)`; `src/lib/whatsapp.ts` →
  `sendInvoiceWhatsApp(inv, lang)`, `sendQuotationWhatsApp(q, lang)`. Area lain memanggil fungsi ini apa adanya (sudah ada stub).
- Halaman lain membuka detail customer dengan `setDetailCustomerId(id); setTab('customers')`; `CustomersPage` yang merender modalnya.
- Halaman lain membuka detail order dengan `setSelectedInvoiceId(id); setTab('orderDetails')`.
- Komponen bersama milik area **sales**: `src/components/app/items-editor.tsx`, `customer-picker.tsx`, `customer-info-panel.tsx`, `print-menu.tsx`.

## Laporan akhir (singkat)
File yang dibuat/diubah, kunci i18n yang ditambah, perbedaan perilaku vs versi lama (dan alasannya), bug lama yang diperbaiki,
hal yang belum bisa dikerjakan.
