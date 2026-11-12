import { PLAN_PERCENTS, PLAN_STAGES, BANK_INFO } from './constants'
import { fmtDate, fmtRp, todayStr, uid } from './format'
import type { DocItem, Invoice, OverdueInvoice, Payment, PlanKey } from './types'
import type { Lang } from '@/i18n'

export function lineTotal(item: Pick<DocItem, 'qty' | 'unitPrice' | 'discount'>) {
  return Math.max(0, (Number(item.qty) || 0) * (Number(item.unitPrice) || 0) - (Number(item.discount) || 0))
}

export const docSubtotal = (items?: DocItem[]) => (items ?? []).reduce((sum, it) => sum + lineTotal(it), 0)

/** Nomor dokumen berikutnya, mis. INV/003/2026 */
export function nextNumber<T extends Record<string, unknown>>(docs: T[], field: keyof T & string, prefix: string) {
  const year = new Date().getFullYear()
  const nums = (docs ?? [])
    .filter((d) => String(d[field] ?? '').endsWith('/' + year))
    .map((d) => parseInt(String(d[field] ?? '').split('/')[1], 10) || 0)
  const max = nums.length ? Math.max(...nums) : 0
  return `${prefix}/${String(max + 1).padStart(3, '0')}/${year}`
}

export function generatePayments(plan: PlanKey, total: number): Payment[] {
  const stages = PLAN_STAGES[plan]
  const percents = PLAN_PERCENTS[plan]
  const amounts = percents.map((p) => Math.round((total * p) / 100))
  const diff = total - amounts.reduce((a, b) => a + b, 0)
  amounts[amounts.length - 1] += diff
  return stages.map((label, i) => ({
    id: uid(),
    label,
    percent: percents[i],
    amount: amounts[i],
    paid: false,
    paidDate: null,
  }))
}

export const paidAmount = (inv: Pick<Invoice, 'payments'>) =>
  (inv.payments ?? []).filter((p) => p.paid).reduce((s, p) => s + p.amount, 0)

/** Label termin terakhir yang sudah dibayar. `null` = belum bayar sama sekali. */
export function currentStatus(inv: Pick<Invoice, 'payments'>): string | null {
  const paid = (inv.payments ?? []).filter((p) => p.paid)
  return paid.length ? paid[paid.length - 1].label : null
}

export function isFullyPaid(inv: Pick<Invoice, 'payments'>) {
  const p = inv.payments ?? []
  return p.length > 0 && p[p.length - 1].paid
}

export function addDays(date: string, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Invoice yang belum lunas dan sudah lewat H-7 dari tanggal event pertama. */
export function computeOverdueInvoices(invoices: Invoice[]): OverdueInvoice[] {
  const today = todayStr()
  const out: OverdueInvoice[] = []
  for (const inv of invoices ?? []) {
    if (isFullyPaid(inv)) continue
    const dates = (inv.items ?? []).map((i) => i.eventDate).filter((d): d is string => !!d).sort()
    if (!dates.length) continue
    const eventDate = dates[0]
    const deadline = addDays(eventDate, -7)
    if (today > deadline) {
      out.push({
        id: inv.id,
        invNumber: inv.invNumber,
        customer: inv.customerSnap?.name,
        phone: inv.customerSnap?.phone,
        eventDate,
        deadline,
        remaining: docSubtotal(inv.items) - paidAmount(inv),
        daysOverdue: Math.round((new Date(today).getTime() - new Date(deadline).getTime()) / 864e5),
      })
    }
  }
  return out.sort((a, b) => b.daysOverdue - a.daysOverdue)
}

export function waPhone(raw?: string) {
  let p = (raw ?? '').replace(/[^0-9]/g, '')
  if (p.startsWith('0')) p = '62' + p.slice(1)
  else if (!p.startsWith('62')) p = '62' + p
  return p
}

export function openWhatsApp(phone: string | undefined, text: string) {
  window.open(`https://wa.me/${waPhone(phone)}?text=${encodeURIComponent(text)}`, '_blank')
}

export function reminderMessage(o: OverdueInvoice, lang: Lang = 'id') {
  const bank = BANK_INFO.replace(/^(\S+ \d+) /, '*$1* ')
  if (lang === 'en') {
    return `#${o.invNumber}\nHi ${o.customer}, a friendly reminder to settle the payment for your event on ${fmtDate(o.eventDate, 'en')}.\n\nRemaining balance: *${fmtRp(o.remaining)}*\nPayments are accepted only via ${bank}\n\nPlease complete it soon, thank you \u{1F64F}\n\nCheers,\nSumeriapoto Team`
  }
  return `#${o.invNumber}\nHalo Kak ${o.customer}, mengingatkan kembali untuk pelunasan pembayaran acara pada ${fmtDate(o.eventDate, 'id')}.\n\nSisa pembayaran: *${fmtRp(o.remaining)}*\nPembayaran hanya melalui rekening ${bank}\n\nMohon segera diselesaikan ya Kak, terima kasih \u{1F64F}\n\nSalam hangat,\nTim Sumeriapoto`
}

export function sortRows<T extends Record<string, unknown>>(rows: T[], sort: { key: string; dir: 'asc' | 'desc' }) {
  const { key, dir } = sort
  const m = dir === 'asc' ? 1 : -1
  return [...rows].sort((a, b) => {
    const x = a[key] as unknown
    const y = b[key] as unknown
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * m
    return String(x ?? '').localeCompare(String(y ?? ''), undefined, { numeric: true }) * m
  })
}
