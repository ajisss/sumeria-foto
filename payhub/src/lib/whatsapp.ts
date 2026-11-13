import { toast } from 'sonner'
import type { Lang } from '@/i18n'
import { BANK_INFO } from './constants'
import { docSubtotal, lineTotal, waPhone } from './calc'
import { docT, type DocT } from './doc-i18n'
import { fmtRp } from './format'
import { downloadInvoicePdf, downloadQuotationPdf } from './pdf'
import type { DocItem, Invoice, Quotation } from './types'

function quotationItemLabel(item: DocItem, t: DocT) {
  const pkg = item.packageItem || ''
  const desc = item.description || ''
  return pkg.toLowerCase() === 'additional' && desc ? `${pkg} ${desc}` : pkg || desc || t('print_item_fallback')
}

export function buildQuotationWaMessage(q: Quotation, lang: Lang = 'id') {
  const t = docT(lang)
  const items = q.items ?? []
  const total = docSubtotal(items)
  const dp = total * 0.3
  return t('print_wa_quotation', {
    items: items.map((it) => `* ${quotationItemLabel(it, t)}: ${fmtRp(lineTotal(it))}`).join('\n'),
    total: fmtRp(total),
    dp: fmtRp(dp),
    rest: fmtRp(total - dp),
    bank: BANK_INFO.replace(/^(\S+ \d+) /, '*$1* '),
  })
}

function open(phone: string | undefined, text: string) {
  window.open(`https://wa.me/${waPhone(phone)}?text=${encodeURIComponent(text)}`, '_blank')
}

export async function sendInvoiceWhatsApp(inv: Invoice, lang: Lang = 'id') {
  const t = docT(lang)
  // WhatsApp dibuka lebih dulu (sinkron dari klik) agar tidak diblokir popup blocker; PDF dibuat async sesudahnya.
  open(inv.customerSnap?.phone, t('print_wa_invoice', { number: inv.invNumber ?? '', name: inv.customerSnap?.name ?? '' }))
  try {
    await downloadInvoicePdf(inv, lang)
  } catch (err) {
    console.error('PDF generation failed', err)
    toast.warning(t('print_pdf_failed'))
  }
}

export async function sendQuotationWhatsApp(q: Quotation, lang: Lang = 'id') {
  const t = docT(lang)
  open(q.customerSnap?.phone, buildQuotationWaMessage(q, lang))
  try {
    await downloadQuotationPdf(q, lang)
  } catch (err) {
    console.error('PDF generation failed', err)
    toast.warning(t('print_pdf_failed'))
  }
}
