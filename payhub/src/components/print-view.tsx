import { useEffect, useState } from 'react'
import { ArrowLeft, FileDown, Printer } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { PrintDocument } from '@/components/print/print-document'
import { useI18n } from '@/i18n'
import { useApp } from '@/lib/app-context'
import { downloadInvoicePdf, downloadQuotationPdf } from '@/lib/pdf'
import { sendInvoiceWhatsApp, sendQuotationWhatsApp } from '@/lib/whatsapp'
import { WA_ICON_SRC } from '@/lib/brand-assets'

interface Target {
  type: 'invoice' | 'quotation'
  id: string
  autoPrint?: boolean
}

export function PrintView({ target, onClose }: { target: Target; onClose: () => void }) {
  const { t, lang } = useI18n()
  const { invoices, quotations } = useApp()
  const invoice = target.type === 'invoice' ? invoices.find((i) => i.id === target.id) : undefined
  const quotation = target.type === 'quotation' ? quotations.find((q) => q.id === target.id) : undefined
  const found = Boolean(invoice ?? quotation)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!target.autoPrint || !found) return
    const timer = setTimeout(() => window.print(), 400)
    return () => clearTimeout(timer)
  }, [target.autoPrint, found])

  const exportPdf = async () => {
    setBusy(true)
    try {
      if (invoice) await downloadInvoicePdf(invoice, lang)
      else if (quotation) await downloadQuotationPdf(quotation, lang)
    } catch (err) {
      console.error('PDF generation failed', err)
      toast.error(t('print_pdf_error'))
    } finally {
      setBusy(false)
    }
  }

  const whatsApp = () => {
    if (invoice) sendInvoiceWhatsApp(invoice, lang)
    else if (quotation) sendQuotationWhatsApp(quotation, lang)
  }

  return (
    <div className="flex min-h-svh flex-col items-center bg-muted px-4 py-6 print:min-h-0 print:bg-white print:p-0">
      <div role="toolbar" aria-label={t('print_toolbar')} className="mb-3.5 flex w-full max-w-[760px] flex-wrap items-center justify-between gap-2 print:hidden">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft aria-hidden="true" />
          {t('print_back')}
        </Button>
        {found && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportPdf} disabled={busy}>
              <FileDown aria-hidden="true" />
              {t('print_menu_export')}
            </Button>
            <Button variant="outline" onClick={whatsApp}>
              <img src={WA_ICON_SRC} alt="" className="size-4" />
              {t('print_menu_whatsapp')}
            </Button>
            <Button onClick={() => window.print()}>
              <Printer aria-hidden="true" />
              {t('print_btn_print')}
            </Button>
          </div>
        )}
      </div>
      {invoice && <PrintDocument type="invoice" data={invoice} />}
      {quotation && <PrintDocument type="quotation" data={quotation} />}
      {!found && <p className="text-sm text-muted-foreground">{t('print_not_found')}</p>}
    </div>
  )
}
