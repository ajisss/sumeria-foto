import { useMemo, useState } from 'react'
import { ArrowRight, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ConfirmDialog } from '@/components/app/confirm-dialog'
import { EmptyState } from '@/components/app/empty-state'
import { PageHeader } from '@/components/app/page-header'
import { PrintMenu } from '@/components/app/print-menu'
import { SearchInput } from '@/components/app/search-input'
import { SortableHead, type SortState } from '@/components/app/sortable-head'
import { useApp } from '@/lib/app-context'
import { docSubtotal, generatePayments, nextNumber, sortRows } from '@/lib/calc'
import { fmtDate, fmtRp, todayStr, uid } from '@/lib/format'
import type { Invoice, Quotation } from '@/lib/types'
import { sendQuotationWhatsApp } from '@/lib/whatsapp'
import { useI18n } from '@/i18n'
import { blankDoc } from './quotations/doc-utils'
import { QuotationModal, type QuotationDraft } from './quotations/quotation-modal'

export default function QuotationsPage() {
  const { t, lang } = useI18n()
  const { quotations, setQuotations, customers, invoices, setInvoices, setTab, setPrintTarget } = useApp()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortState>({ key: 'date', dir: 'desc' })
  const [editing, setEditing] = useState<QuotationDraft | null>(null)
  const [deleting, setDeleting] = useState<Quotation | null>(null)
  const [reconvert, setReconvert] = useState<{ quo: Quotation; invNumber: string } | null>(null)

  const rows = useMemo(() => {
    const q = search.toLowerCase()
    const all = quotations.map((x) => ({ ...x, subtotal: docSubtotal(x.items), dp: docSubtotal(x.items) * 0.3 }))
    return sortRows(all.filter((x) => !q || JSON.stringify(x).toLowerCase().includes(q)), sort)
  }, [quotations, search, sort])

  function create() {
    setEditing({ ...blankDoc(), quoNumber: nextNumber(quotations, 'quoNumber', 'QUO'), date: todayStr() })
  }

  function save(doc: QuotationDraft) {
    const isNew = !doc.id
    const stamped = { ...doc, lastUpdated: todayStr() }
    setQuotations((prev) => (doc.id ? prev.map((x) => (x.id === doc.id ? { ...x, ...stamped } : x)) : [...prev, { ...stamped, id: uid() }]))
    setEditing(null)
    toast.success(t(isNew ? 'sales_quo_created' : 'sales_quo_updated'))
  }

  function remove(id: string) {
    setQuotations((prev) => prev.filter((x) => x.id !== id))
    setDeleting(null)
    toast.success(t('sales_quo_deleted'))
  }

  function convert(q: Quotation) {
    const items = q.items.map((it) => ({ ...it, id: uid() }))
    const inv: Invoice = {
      id: uid(),
      invNumber: nextNumber(invoices, 'invNumber', 'INV'),
      date: todayStr(),
      customerId: q.customerId,
      customerSnap: q.customerSnap,
      items,
      paymentPlan: '2x',
      payments: generatePayments('2x', docSubtotal(items)),
      notes: '',
      lastUpdated: todayStr(),
      sourceQuotationId: q.id,
    }
    setInvoices((prev) => [...prev, inv])
    setReconvert(null)
    setTab('invoices')
    toast.success(t('sales_converted_toast'))
  }

  function requestConvert(q: Quotation) {
    const existing = invoices.find((i) => i.sourceQuotationId === q.id)
    if (existing) setReconvert({ quo: q, invNumber: existing.invNumber ?? '' })
    else convert(q)
  }

  return (
    <div>
      <PageHeader
        title={t('quo_title')}
        subtitle={t('i18n_quo_subtitle', { count: quotations.length })}
        action={
          <Button onClick={create}>
            <Plus /> {t('quo_create')}
          </Button>
        }
      />
      <Card className="mb-4 p-3">
        <SearchInput value={search} onChange={setSearch} />
      </Card>
      {rows.length === 0 ? (
        <EmptyState text={t('quo_empty')} />
      ) : (
        <Card className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead label={t('quo_number')} sortKey="quoNumber" sort={sort} setSort={setSort} />
                <TableHead>{t('quo_col_customer')}</TableHead>
                <SortableHead label={t('quo_date')} sortKey="date" sort={sort} setSort={setSort} />
                <SortableHead label={t('quo_subtotal')} sortKey="subtotal" sort={sort} setSort={setSort} />
                <TableHead>{t('quo_col_dp')}</TableHead>
                <TableHead className="w-44">
                  <span className="sr-only">{t('sales_actions')}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const q = quotations.find((x) => x.id === r.id)
                if (!q) return null
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-semibold">{r.quoNumber}</TableCell>
                    <TableCell>{r.customerSnap?.name}</TableCell>
                    <TableCell>{fmtDate(r.date, lang)}</TableCell>
                    <TableCell className="tabular-nums">{fmtRp(r.subtotal)}</TableCell>
                    <TableCell className="tabular-nums">{fmtRp(r.dp)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <PrintMenu
                          onExportPdf={() => setPrintTarget({ type: 'quotation', id: q.id, autoPrint: true })}
                          onWhatsApp={() => sendQuotationWhatsApp(q, lang)}
                        />
                        <Button variant="ghost" size="icon-sm" aria-label={t('edit')} title={t('edit')} onClick={() => setEditing(q)}>
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t('sales_convert_to_invoice')}
                          title={t('sales_convert_to_invoice')}
                          onClick={() => requestConvert(q)}
                        >
                          <ArrowRight className="text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" aria-label={t('delete')} title={t('delete')} onClick={() => setDeleting(q)}>
                          <Trash2 className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {editing && <QuotationModal doc={editing} customers={customers} onSave={save} onClose={() => setEditing(null)} />}

      <ConfirmDialog
        open={!!deleting}
        title={t('sales_delete_quo_title')}
        description={deleting ? t('i18n_quo_delete_desc', { number: deleting.quoNumber ?? '' }) : undefined}
        onConfirm={() => deleting && remove(deleting.id)}
        onCancel={() => setDeleting(null)}
      />
      <ConfirmDialog
        open={!!reconvert}
        destructive={false}
        title={t('sales_reconvert_title')}
        description={reconvert ? t('sales_reconvert_desc', { quo: reconvert.quo.quoNumber ?? '', inv: reconvert.invNumber }) : undefined}
        confirmLabel={t('sales_reconvert_confirm')}
        onConfirm={() => reconvert && convert(reconvert.quo)}
        onCancel={() => setReconvert(null)}
      />
    </div>
  )
}
