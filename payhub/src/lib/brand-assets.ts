// Aset & konstanta brand untuk dokumen cetak / PDF / WhatsApp.
// Dokumen bisnis selalu terang (print-safe), tidak mengikuti tema aplikasi.
import logo from '@/assets/logo.png?inline'
import logoPdf from '@/assets/logo-pdf.png?inline'
import waIcon from '@/assets/wa-icon.png'

/** Data URI (di-inline oleh Vite) — dibutuhkan jsPDF.addImage. */
export const LOGO_DATA_URI: string = logo
/** Versi 840 px (cukup untuk 210 pt @ 288 dpi) khusus PDF — ukuran file kecil. Rasio sama dengan logo.png. */
export const LOGO_PDF_DATA_URI: string = logoPdf
export const LOGO_SRC: string = logo
export const WA_ICON_SRC: string = waIcon
/** Lebar : tinggi logo (1400 x 232 px). */
export const LOGO_ASPECT = 1400 / 232

export const BRAND_NAME = 'Sumériapoto'
export const BRAND_TAGLINE = 'Photography & Videography'
export const BRAND_ADDRESS = 'Perumahan Taman Raya Citayam, Blok E4 No.02, Kecamatan Bojonggede, Bogor, Jawa Barat'
export const BRAND_PHONE = '0813 4000 4073'
export const BRAND_INSTAGRAM = '@Sumeriapoto'
export const BANK_NAME = 'BCA'
export const BANK_NUMBER = '8761141988'
export const BANK_HOLDER = 'Mochamad Annas Afan'

type RGB = readonly [number, number, number]

/** Warna PDF (RGB) persis dari versi lama. */
export const PDF_COLORS = {
  ink: [20, 20, 20] as RGB,
  body: [30, 30, 30] as RGB,
  soft: [110, 110, 110] as RGB,
  muted: [120, 120, 120] as RGB,
  tableHead: [90, 90, 90] as RGB,
  tableHeadBg: [244, 246, 248] as RGB,
  desc: [122, 122, 122] as RGB,
  line: [228, 231, 235] as RGB,
  rowLine: [232, 232, 232] as RGB,
  blue: [30, 58, 95] as RGB,
  blueBg: [230, 237, 246] as RGB,
  blueBorder: [150, 176, 210] as RGB,
  green: [31, 122, 77] as RGB,
  paidBg: [209, 237, 222] as RGB,
  paidText: [13, 92, 58] as RGB,
  pending: [165, 165, 165] as RGB,
  footer: [140, 140, 140] as RGB,
}
