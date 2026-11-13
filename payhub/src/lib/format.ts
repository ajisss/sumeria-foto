import type { Lang } from '@/i18n'

/** UUID v4. Pakai crypto.randomUUID; fallback getRandomValues (mis. konteks non-secure). ID lama (string pendek) tetap valid. */
export function uid(): string {
  const c = globalThis.crypto
  if (c && typeof c.randomUUID === 'function') return c.randomUUID()
  const b = new Uint8Array(16)
  c.getRandomValues(b)
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}
export const todayStr = () => new Date().toISOString().slice(0, 10)

const locale = (lang: Lang) => (lang === 'en' ? 'en-US' : 'id-ID')

export const fmtRp = (n: number | null | undefined) => 'Rp ' + Math.round(n || 0).toLocaleString('id-ID')

export function fmtDate(d?: string | null, lang: Lang = 'id') {
  if (!d) return '-'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return date.toLocaleDateString(locale(lang), { day: '2-digit', month: 'short', year: 'numeric' })
}

/** dd/mm/yy untuk PDF */
export function fmtDatePdf(d?: string | null) {
  if (!d) return '-'
  const a = new Date(d)
  if (Number.isNaN(a.getTime())) return d
  return `${String(a.getDate()).padStart(2, '0')}/${String(a.getMonth() + 1).padStart(2, '0')}/${String(a.getFullYear()).slice(-2)}`
}

export function monthKey(d: string | Date) {
  const a = new Date(d)
  return `${a.getFullYear()}-${String(a.getMonth() + 1).padStart(2, '0')}`
}

export function monthLabel(key: string, lang: Lang = 'id') {
  const [y, m] = key.split('-')
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString(locale(lang), { month: 'short', year: '2-digit' })
}

export function monthLabelLong(key: string, lang: Lang = 'id') {
  const [y, m] = key.split('-')
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString(locale(lang), { month: 'long', year: 'numeric' })
}
