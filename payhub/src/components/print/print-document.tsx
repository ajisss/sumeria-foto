import { useI18n } from '@/i18n'
import { currentStatus, docSubtotal, lineTotal } from '@/lib/calc'
import { stageLabel, splitDescLines, docT } from '@/lib/doc-i18n'
import { BANK_HOLDER, BANK_NAME, BANK_NUMBER, BRAND_ADDRESS, BRAND_INSTAGRAM, BRAND_NAME, BRAND_PHONE, BRAND_TAGLINE, LOGO_SRC } from '@/lib/brand-assets'
import { fmtDate, fmtRp } from '@/lib/format'
import type { Invoice, Quotation } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { WatermarkPattern } from './watermark-pattern'
import './print.css'

const PAD_X = 'px-[clamp(18px,6vw,52px)]'
const LABEL = 'text-[10.5px] uppercase tracking-[0.1em] text-(--doc-ink-soft)'
const TH = 'h-auto px-1 py-2 text-[9.5px] font-semibold uppercase tracking-[0.04em] text-(--doc-ink-soft)'
const PRICE = 'px-1 py-[9px] text-right align-top text-[11px] whitespace-nowrap max-[480px]:px-0.5 max-[480px]:text-[9.3px] max-[360px]:px-px max-[360px]:text-[7.6px]'
const ROW = 'border-(--doc-line) hover:bg-transparent'

type Props =
  | { type: 'invoice'; data: Invoice }
  | { type: 'quotation'; data: Quotation }

export function PrintDocument(props: Props) {
  const { lang } = useI18n()
  const t = docT(lang)
  const isInvoice = props.type === 'invoice'
  const doc = props.data
  const subtotal = docSubtotal(doc.items)
  const snap = doc.customerSnap
  const invoice = props.type === 'invoice' ? props.data : null

  return (
    <article
      className="print-doc print-sheet relative w-full max-w-[760px] overflow-hidden rounded-sm shadow-lg ring-1 ring-(--doc-line) print:m-0 print:shadow-none print:ring-0"
      aria-label={isInvoice ? t('print_doc_invoice') : t('print_doc_quotation')}
    >
      <WatermarkPattern />
      <div className="relative z-10">
        <header className={cn('flex items-start justify-between gap-4 border-b border-(--doc-line) pt-9 pb-6', PAD_X)}>
          <div>
            <img src={LOGO_SRC} alt={BRAND_NAME} className="block h-[30px] w-auto" />
            <div className="mt-1.5 text-[10.5px] uppercase tracking-[0.14em] text-(--doc-ink-soft)">{BRAND_TAGLINE}</div>
          </div>
          <div className="text-right">
            <div className="text-[17px] font-semibold tracking-[0.06em]">
              {isInvoice ? t('print_doc_invoice') : t('print_doc_quotation')}
            </div>
            <div className="mt-[5px] text-[12.5px] text-(--doc-ink-soft)">{invoice ? invoice.invNumber : (doc as Quotation).quoNumber}</div>
            <div className="text-xs text-(--doc-ink-soft)">{fmtDate(doc.date, lang)}</div>
          </div>
        </header>

        <section className={cn('flex justify-between gap-6 pt-[26px]', PAD_X)}>
          <div>
            <div className={cn(LABEL, 'mb-2')}>{t('print_bill_to')}</div>
            <div className="text-sm font-semibold">{snap?.name}</div>
            <div className="mt-0.5 text-[12.5px] leading-[1.8] text-(--doc-ink-soft)">
              {String(snap?.address ?? '')}
              <br />
              {snap?.phone}
              <br />
              {snap?.email}
            </div>
          </div>
          {invoice && (
            <div className="text-right">
              <div className={cn(LABEL, 'mb-2')}>{t('print_status')}</div>
              <div className="text-[13.5px] font-bold text-(--doc-blue)">{stageLabel(currentStatus(invoice), t)}</div>
            </div>
          )}
        </section>

        <section className={cn('pt-7', PAD_X)}>
          <Table className="table-fixed text-[12.5px]">
            <colgroup>
              <col className="w-[4%]" />
              <col className="w-[29%]" />
              <col className="w-[6%]" />
              <col className="w-[20%]" />
              <col className="w-[17%]" />
              <col className="w-[24%]" />
            </colgroup>
            <TableHeader>
              <TableRow className={ROW}>
                <TableHead className={cn(TH, 'text-left')}>{t('print_col_no')}</TableHead>
                <TableHead className={cn(TH, 'text-left')}>{t('print_col_item')}</TableHead>
                <TableHead className={cn(TH, 'text-center')}>{t('print_col_qty')}</TableHead>
                <TableHead className={cn(TH, 'text-right max-[360px]:text-[7.3px] max-[360px]:tracking-normal')}>{t('print_col_price')}</TableHead>
                <TableHead className={cn(TH, 'text-right max-[360px]:text-[7.3px] max-[360px]:tracking-normal')}>{t('print_col_disc')}</TableHead>
                <TableHead className={cn(TH, 'text-right max-[360px]:text-[7.3px] max-[360px]:tracking-normal')}>{t('print_col_subtotal')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(doc.items ?? []).map((it, i) => (
                <TableRow key={it.id} className={ROW}>
                  <TableCell className="px-1 py-[9px] align-top text-[11.5px] text-(--doc-ink-soft)">{i + 1}</TableCell>
                  <TableCell className="px-1 py-[9px] align-top break-words whitespace-normal max-[480px]:px-0.5">
                    <div className="text-xs font-semibold max-[480px]:text-[11px]">{it.packageItem}</div>
                    {it.description && (
                      <div className="mt-0.5 text-[10.5px] leading-normal text-(--doc-ink-soft)">
                        {splitDescLines(it.description).map((line, k) => (
                          <div key={k}>• {line}</div>
                        ))}
                      </div>
                    )}
                    {it.eventDate && <div className="mt-0.5 text-[10px] text-(--doc-ink-soft)">{fmtDate(it.eventDate, lang)}</div>}
                  </TableCell>
                  <TableCell className="px-1 py-[9px] text-center align-top text-[11.5px]">{it.qty}</TableCell>
                  <TableCell className={PRICE}>{fmtRp(Number(it.unitPrice))}</TableCell>
                  <TableCell className={PRICE}>{fmtRp(Number(it.discount))}</TableCell>
                  <TableCell className={cn(PRICE, 'font-semibold')}>{fmtRp(lineTotal(it))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-[18px] flex justify-end">
            <div className="w-[260px] max-w-full">
              <div className="flex justify-between py-2 text-[13px]">
                <span className="text-(--doc-ink-soft)">{t('print_subtotal')}</span>
                <span className="font-bold">{fmtRp(subtotal)}</span>
              </div>
              {!invoice && (
                <div className="flex justify-between border-t border-(--doc-line) py-2 text-[13px]">
                  <span className="text-(--doc-ink-soft)">{t('print_dp')}</span>
                  <span className="font-bold text-(--doc-blue)">{fmtRp(subtotal * 0.3)}</span>
                </div>
              )}
            </div>
          </div>

          {invoice && (
            <div className="mt-[26px]">
              <div className={cn(LABEL, 'mb-2.5')}>
                {t('print_plan')} — {invoice.paymentPlan}
              </div>
              <Table className="text-[12.5px]">
                <TableBody>
                  {(invoice.payments ?? []).map((p) => (
                    <TableRow key={p.id} className={ROW}>
                      <TableCell className="px-1.5 py-[7px] whitespace-normal">{stageLabel(p.label, t)}</TableCell>
                      <TableCell className="px-1.5 py-[7px] text-right">{Number(p.percent).toFixed(1)}%</TableCell>
                      <TableCell className="px-1.5 py-[7px] text-right font-semibold">{fmtRp(p.amount)}</TableCell>
                      <TableCell className="px-1.5 py-[7px] text-right">
                        <span className={cn('text-[10.5px] font-bold', p.paid ? 'text-(--doc-green)' : 'text-(--doc-amber)')}>
                          {p.paid ? t('print_paid') : t('print_pending')}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>

        <section className={cn('mt-3.5 border-t border-(--doc-line) py-7', PAD_X)}>
          <div className={cn(LABEL, 'mb-2')}>{t('print_pay_info')}</div>
          <div className="text-[12.5px]">{t('print_pay_only')}</div>
          <div className="mt-1 text-sm font-bold text-(--doc-blue)">
            {BANK_NAME} — {BANK_NUMBER}
          </div>
          <div className="text-[12.5px] text-(--doc-ink-soft)">{BANK_HOLDER}</div>
          <div className="mt-5 text-[12.5px] text-(--doc-ink-soft)">{t('print_thanks')}</div>
        </section>

        <footer className={cn('border-t border-(--doc-line) pt-4 pb-[30px] text-center text-[10.5px] leading-[1.7] text-(--doc-ink-soft)', PAD_X)}>
          {BRAND_ADDRESS}
          <br />
          {t('print_contact', { phone: BRAND_PHONE, ig: BRAND_INSTAGRAM })}
        </footer>
      </div>
    </article>
  )
}
