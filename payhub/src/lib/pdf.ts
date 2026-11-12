import type { jsPDF } from 'jspdf'
import type { Lang } from '@/i18n'
import {
  BANK_HOLDER, BANK_NAME, BANK_NUMBER, BRAND_ADDRESS, BRAND_INSTAGRAM, BRAND_PHONE, BRAND_TAGLINE,
  LOGO_ASPECT, LOGO_PDF_DATA_URI, PDF_COLORS as C,
} from './brand-assets'
import { currentStatus, docSubtotal, isFullyPaid, lineTotal } from './calc'
import { docT, splitDescLines, stageLabel, type DocT } from './doc-i18n'
import { fmtDatePdf, fmtRp } from './format'
import type { Invoice, Quotation } from './types'

type JsPdfModule = typeof import('jspdf')
let jsPdfModule: JsPdfModule | undefined

/** jsPDF (+ html2canvas, purify) dimuat on-demand supaya tidak membengkakkan bundle awal. */
async function loadJsPdf(): Promise<JsPdfModule> {
  jsPdfModule ??= await import('jspdf')
  return jsPdfModule
}

/** Alias logo: data PNG di-embed SEKALI, semua pemakaian (header + watermark) merujuk objek yang sama. */
const LOGO_ALIAS = 'sumeria-logo'

function newPdf(mod: JsPdfModule) {
  // compress: true -> stream (Flate) untuk konten & gambar; tanpa ini logo tersimpan mentah (~1 MB).
  return new mod.jsPDF({ unit: 'pt', format: 'a4', compress: true })
}

const MARGIN = 48
const PAGE_BREAK_Y = 740
const NEW_PAGE_Y = 56

type Color = readonly [number, number, number]
const text = (pdf: jsPDF, c: Color) => pdf.setTextColor(c[0], c[1], c[2])
const fill = (pdf: jsPDF, c: Color) => pdf.setFillColor(c[0], c[1], c[2])
const draw = (pdf: jsPDF, c: Color) => pdf.setDrawColor(c[0], c[1], c[2])

/** Logo berulang (-25 derajat, opacity 5%) di setiap halaman. */
export function addWatermarks(pdf: jsPDF) {
  try {
    const pages = pdf.getNumberOfPages()
    const w = pdf.internal.pageSize.getWidth()
    const h = pdf.internal.pageSize.getHeight()
    const cols = 5
    const rows = 7
    const lw = 95
    const lh = lw / LOGO_ASPECT
    for (let page = 1; page <= pages; page++) {
      pdf.setPage(page)
      pdf.saveGraphicsState()
      pdf.setGState(new (jsPdfModule as JsPdfModule).GState({ opacity: 0.05 }))
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ((c + 0.5) / cols) * w
          const y = ((r + 0.5) / rows) * h
          pdf.addImage(LOGO_PDF_DATA_URI, 'PNG', x - lw / 2, y - lh / 2, lw, lh, LOGO_ALIAS, 'FAST', -25)
        }
      }
      pdf.restoreGraphicsState()
    }
  } catch (err) {
    console.error('watermark failed', err)
  }
}

/** Stempel "PAID FULL" di halaman pertama untuk invoice yang sudah lunas. */
export function addPaidFullStamp(pdf: jsPDF, t: DocT) {
  try {
    const w = pdf.internal.pageSize.getWidth()
    pdf.setPage(1)
    pdf.saveGraphicsState()
    pdf.setGState(new (jsPdfModule as JsPdfModule).GState({ opacity: 0.85 }))
    const cx = w - 98
    const cy = 120
    draw(pdf, C.green)
    pdf.setLineWidth(2.4)
    pdf.circle(cx, cy, 46, 'S')
    pdf.setLineWidth(0.9)
    pdf.circle(cx, cy, 38, 'S')
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(13)
    text(pdf, C.green)
    pdf.text(t('print_stamp_1'), cx, cy - 4, { align: 'center', angle: -14 })
    pdf.text(t('print_stamp_2'), cx, cy + 12, { align: 'center', angle: -14 })
    pdf.setFontSize(6)
    pdf.text('SUMERIAPOTO', cx, cy + 25, { align: 'center', angle: -14 })
    pdf.restoreGraphicsState()
  } catch (err) {
    console.error('paid stamp failed', err)
  }
}

interface Doc {
  items: Invoice['items']
  customerSnap?: Invoice['customerSnap']
  date?: string
}

interface Cursor {
  y: number
}

function header(pdf: jsPDF, t: DocT, title: string, number: string | undefined, doc: Doc, status?: string): Cursor {
  const w = pdf.internal.pageSize.getWidth()
  let y = 64
  const lw = 210
  const lh = lw / LOGO_ASPECT
  try {
    pdf.addImage(LOGO_PDF_DATA_URI, 'PNG', MARGIN, y - lh, lw, lh, LOGO_ALIAS, 'FAST')
  } catch (err) {
    console.error('logo embed failed', err)
  }
  const logoBottom = y
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8.5)
  text(pdf, C.muted)
  pdf.text(BRAND_TAGLINE.toUpperCase(), MARGIN, logoBottom + 13)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(17)
  text(pdf, C.ink)
  pdf.text(title, w - MARGIN, y - lh + 16, { align: 'right' })
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  text(pdf, [100, 100, 100])
  pdf.text(number || '', w - MARGIN, y - lh + 33, { align: 'right' })
  pdf.text(fmtDatePdf(doc.date), w - MARGIN, y - lh + 47, { align: 'right' })
  y = logoBottom + 13 + 22
  draw(pdf, C.line)
  pdf.line(MARGIN, y, w - MARGIN, y)
  y += 26
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(9.5)
  text(pdf, C.ink)
  pdf.text(t('print_bill_to').toUpperCase(), MARGIN, y)
  if (status !== undefined) {
    text(pdf, C.blue)
    pdf.text(`${t('print_status')}: ${status}`, w - MARGIN, y, { align: 'right' })
  }
  y += 16
  const snap = doc.customerSnap
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  text(pdf, C.body)
  pdf.text(String(snap?.name || ''), MARGIN, y)
  y += 14
  text(pdf, C.soft)
  pdf.setFontSize(9)
  pdf.text(String(snap?.address || ''), MARGIN, y)
  y += 13
  pdf.text(String(snap?.phone || ''), MARGIN, y)
  y += 13
  pdf.text(String(snap?.email || ''), MARGIN, y)
  return { y: y + 28 }
}

function itemsTable(pdf: jsPDF, t: DocT, doc: Doc, cur: Cursor) {
  const w = pdf.internal.pageSize.getWidth()
  const cols = [
    { label: t('print_col_no'), w: 22, align: 'left' },
    { label: t('print_col_event'), w: 62, align: 'left' },
    { label: t('print_col_item'), w: 108, align: 'left' },
    { label: t('print_col_qty'), w: 24, align: 'center' },
    { label: t('print_col_price'), w: 95, align: 'right' },
    { label: t('print_col_disc'), w: 78, align: 'right' },
    { label: t('print_col_subtotal'), w: 109, align: 'right' },
  ] as const

  const row = (values: (string | number)[], bold: boolean, color: Color) => {
    let x = MARGIN
    pdf.setFont('helvetica', bold ? 'bold' : 'normal')
    pdf.setFontSize(bold ? 8.5 : 9)
    text(pdf, color)
    cols.forEach((col, i) => {
      const px = col.align === 'right' ? x + col.w - 4 : x + 4
      pdf.text(String(values[i]), px, cur.y, {
        align: col.align === 'right' ? 'right' : 'left',
        ...(i === 2 ? { maxWidth: col.w - 6 } : {}),
      })
      x += col.w
    })
  }

  fill(pdf, C.tableHeadBg)
  pdf.rect(MARGIN, cur.y - 12, w - MARGIN * 2, 18, 'F')
  row(cols.map((c) => c.label), true, C.tableHead)
  cur.y += 16

  doc.items.forEach((it, idx) => {
    if (cur.y > PAGE_BREAK_Y) {
      pdf.addPage()
      cur.y = NEW_PAGE_Y
    }
    row([idx + 1, fmtDatePdf(it.eventDate), '', it.qty, fmtRp(Number(it.unitPrice)), fmtRp(Number(it.discount)), fmtRp(lineTotal(it))], false, C.body)
    const ix = MARGIN + 88
    const iw = 102
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    text(pdf, C.body)
    const nameLines: string[] = pdf.splitTextToSize(it.packageItem || '', iw)
    let iy = cur.y
    nameLines.forEach((ln, i) => {
      pdf.text(ln, ix, iy)
      if (i < nameLines.length - 1) iy += 11
    })
    let dy = iy + 10
    const descLines = splitDescLines(it.description)
    if (descLines.length) {
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(7.5)
      text(pdf, C.desc)
      descLines.forEach((dl) => {
        const wrapped: string[] = pdf.splitTextToSize('• ' + dl, iw)
        wrapped.forEach((wl) => {
          if (cur.y > 730) {
            pdf.addPage()
            cur.y = NEW_PAGE_Y
            dy = cur.y + 10
          }
          pdf.text(wl, ix, dy)
          dy += 9
        })
      })
    }
    const sepY = Math.max(cur.y + 6, dy - 3)
    draw(pdf, C.rowLine)
    pdf.line(MARGIN, sepY, w - MARGIN, sepY)
    cur.y = Math.max(cur.y + 20, iy + 16, dy + 6)
  })
  cur.y += 12
}

function paymentInfo(pdf: jsPDF, t: DocT, cur: Cursor) {
  if (cur.y > 700) {
    pdf.addPage()
    cur.y = NEW_PAGE_Y
  }
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(9)
  text(pdf, C.tableHead)
  pdf.text(t('print_pay_info').toUpperCase(), MARGIN, cur.y)
  cur.y += 14
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9.5)
  text(pdf, C.body)
  pdf.text(t('print_pay_only'), MARGIN, cur.y)
  cur.y += 12
  const bx = MARGIN
  const by = cur.y
  const bw = 168
  const bh = 32
  fill(pdf, C.blueBg)
  pdf.roundedRect(bx, by, bw, bh, 6, 6, 'F')
  draw(pdf, C.blueBorder)
  pdf.setLineWidth(1.5)
  pdf.roundedRect(bx, by, bw, bh, 6, 6, 'S')
  fill(pdf, C.blue)
  pdf.roundedRect(bx, by + 5, 4, bh - 10, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  text(pdf, C.blue)
  pdf.text(`${BANK_NAME} — ${BANK_NUMBER}`, bx + 13, by + 14)
  pdf.setFontSize(7.5)
  text(pdf, [100, 100, 100])
  pdf.text(t('print_bank_holder', { name: BANK_HOLDER }), bx + 13, by + 25)
  cur.y = by + bh + 20
}

function footer(pdf: jsPDF, t: DocT) {
  const w = pdf.internal.pageSize.getWidth()
  const fy = pdf.internal.pageSize.getHeight() - 38
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  text(pdf, C.footer)
  pdf.text(BRAND_ADDRESS, w / 2, fy, { align: 'center' })
  pdf.text(t('print_contact', { phone: BRAND_PHONE, ig: BRAND_INSTAGRAM }).replace(' · ', '   |   '), w / 2, fy + 13, { align: 'center' })
}

export async function buildInvoicePdf(inv: Invoice, lang: Lang = 'id') {
  const t = docT(lang)
  const pdf = newPdf(await loadJsPdf())
  const w = pdf.internal.pageSize.getWidth()
  const cur = header(pdf, t, t('print_doc_invoice'), inv.invNumber, inv, stageLabel(currentStatus(inv), t))
  itemsTable(pdf, t, inv, cur)

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(11)
  text(pdf, C.ink)
  pdf.text(`${t('print_subtotal')}: ${fmtRp(docSubtotal(inv.items))}`, w - MARGIN, cur.y, { align: 'right' })
  cur.y += 28
  if (cur.y > 700) {
    pdf.addPage()
    cur.y = NEW_PAGE_Y
  }
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(9)
  text(pdf, C.tableHead)
  pdf.text(`${t('print_plan').toUpperCase()} — ${inv.paymentPlan || ''}`, MARGIN, cur.y)
  cur.y += 16
  ;(inv.payments ?? []).forEach((p) => {
    if (cur.y > PAGE_BREAK_Y) {
      pdf.addPage()
      cur.y = NEW_PAGE_Y
    }
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9.5)
    text(pdf, C.body)
    pdf.text(stageLabel(p.label, t), MARGIN, cur.y)
    pdf.text(Number(p.percent).toFixed(1) + '%', MARGIN + 170, cur.y)
    pdf.text(fmtRp(p.amount), MARGIN + 240, cur.y)
    if (p.paid) {
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(9.5)
      const label = t('print_paid')
      const pw = pdf.getTextWidth(label) + 16
      fill(pdf, C.paidBg)
      pdf.roundedRect(w - MARGIN - pw, cur.y - 11, pw, 15, 7, 7, 'F')
      text(pdf, C.paidText)
      pdf.text(label, w - MARGIN - 8, cur.y, { align: 'right' })
    } else {
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(9)
      text(pdf, C.pending)
      pdf.text(t('print_pending'), w - MARGIN, cur.y, { align: 'right' })
    }
    cur.y += 16
  })
  cur.y += 18
  paymentInfo(pdf, t, cur)
  footer(pdf, t)
  if (isFullyPaid(inv)) addPaidFullStamp(pdf, t)
  addWatermarks(pdf)
  return pdf
}

export async function buildQuotationPdf(q: Quotation, lang: Lang = 'id') {
  const t = docT(lang)
  const pdf = newPdf(await loadJsPdf())
  const w = pdf.internal.pageSize.getWidth()
  const cur = header(pdf, t, t('print_doc_quotation'), q.quoNumber, q)
  itemsTable(pdf, t, q, cur)

  const subtotal = docSubtotal(q.items)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(11)
  text(pdf, C.ink)
  pdf.text(`${t('print_subtotal')}: ${fmtRp(subtotal)}`, w - MARGIN, cur.y, { align: 'right' })
  cur.y += 16
  text(pdf, C.blue)
  pdf.text(`${t('print_dp')}: ${fmtRp(subtotal * 0.3)}`, w - MARGIN, cur.y, { align: 'right' })
  cur.y += 30
  paymentInfo(pdf, t, cur)
  footer(pdf, t)
  addWatermarks(pdf)
  return pdf
}

const fileSafe = (n: string) => n.split('/').join('-')

export async function downloadInvoicePdf(inv: Invoice, lang: Lang = 'id') {
  const pdf = await buildInvoicePdf(inv, lang)
  const name = `Invoice-${fileSafe(inv.invNumber || 'Sumeriapoto')}.pdf`
  pdf.save(name)
  return name
}

export async function downloadQuotationPdf(q: Quotation, lang: Lang = 'id') {
  const pdf = await buildQuotationPdf(q, lang)
  const name = `Quotation-${fileSafe(q.quoNumber || 'Sumeriapoto')}.pdf`
  pdf.save(name)
  return name
}
