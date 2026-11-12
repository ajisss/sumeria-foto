import { useMemo, useState } from 'react'
import { ClipboardList, Pencil, Plus, Trash2 } from 'lucide-react'
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
import { StatusBadge, type Tone } from '@/components/app/status-badge'
import { useApp } from '@/lib/app-context'
import { currentStatus, docSubtotal, nextNumber, sortRows } from '@/lib/calc'
import { statusLabel } from '@/lib/doc-i18n'
import { fmtDate, fmtRp, todayStr, uid } from '@/lib/format'
import type { Invoice } from '@/lib/types'
import { sendInvoiceWhatsApp } from '@/lib/whatsapp'
import { useI18n } from '@/i18n'
import { InvoiceModal, type InvoiceDraft } from './invoices/invoice-modal'
import { blankDoc } from './quotations/doc-utils'

const statusTone = (s: string | null): Tone => (s === 'Paid Full' ? 'success' : s === null ? 'neutral' : 'warning')

export default function InvoicesPage() {
  const { t, lang } = useI18n()
  const { invoices, setInvoices, customers, quotations, setPrintTarget, setTab, setSelectedInvoiceId } = useApp()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortState>({ key: 'date', dir: 'desc' })
  const [editing, setEditing] = useState<InvoiceDraft | null>(null)
  const [deleting, setDeleting] = useState<Invoice | null>(null)

  const rows = useMemo(() => {
    const q = search.toLowerCase()
    const all = invoices.map((x) => ({ ...x, total: docSubtotal(x.items), status: currentStatus(x) }))
    return sortRows(all.filter((x) => !q || JSON.stringify(x).toLowerCase().includes(q)), sort)
  }, [invoices, search, sort])

  function create() {
    setEditing({
      ...blankDoc(),
      invNumber: nextNumber(invoices, 'invNumber', 'INV'),
      date: todayStr(),
      paymentPlan: '2x',
      payments: [],
      notes: '',
    })
  }

  function save(doc: InvoiceDraft) {
    const isNew = !doc.id
    const stamped = { ...doc, lastUpdated: todayStr() }
    setInvoices((prev) =>
      doc.id
        ? prev.map((x) => (x.id === doc.id ? { ...x, ...stamped } : x))
        : [...prev, { ...stamped, id: uid(), paymentPlan: stamped.paymentPlan ?? '2x', payments: stamped.payments ?? [] }],
    )
    setEditing(null)
    toast.success(t(isNew ? 'sales_inv_created' : 'sales_inv_saved'))
  }

  function remove(id: string) {
    setInvoices((prev) => prev.filter((x) => x.id !== id))
    setDeleting(null)
    toast.success(t('sales_inv_deleted'))
  }

  return (
    <div>
      <PageHeader
        title={t('inv_title')}
        subtitle={t('i18n_inv_subtitle', { count: invoices.length })}
        action={
          <Button onClick={create}>
            <Plus /> {t('inv_create')}
          </Button>
        }
      />
      <Card className="mb-4 p-3">
        <SearchInput value={search} onChange={setSearch} />
      </Card>
      {rows.length === 0 ? (
        <EmptyState text={t('inv_empty')} />
      ) : (
        <Card className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead label={t('inv_number')} sortKey="invNumber" sort={sort} setSort={setSort} />
                <TableHead>{t('quo_col_customer')}</TableHead>
                <SortableHead label={t('col_total')} sortKey="total" sort={sort} setSort={setSort} />
                <TableHead>{t('inv_col_status')}</TableHead>
                <SortableHead label={t('inv_col_updated')} sortKey="lastUpdated" sort={sort} setSort={setSort} />
                <TableHead className="w-44">
                  <span className="sr-only">{t('sales_actions')}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const inv = invoices.find((x) => x.id === r.id)
                if (!inv) return null
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-semibold">{r.invNumber}</TableCell>
                    <TableCell>{r.customerSnap?.name}</TableCell>
                    <TableCell className="tabular-nums">{fmtRp(r.total)}</TableCell>
                    <TableCell>
                      <StatusBadge tone={statusTone(r.status)}>{statusLabel(r.status, t)}</StatusBadge>
                    </TableCell>
                    <TableCell>{fmtDate(r.lastUpdated, lang)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t('nav_orderDetails')}
                          title={t('nav_orderDetails')}
                          onClick={() => {
                            setSelectedInvoiceId(inv.id)
                            setTab('orderDetails')
                          }}
                        >
                          <ClipboardList />
                        </Button>
                        <PrintMenu
                          onExportPdf={() => setPrintTarget({ type: 'invoice', id: inv.id, autoPrint: true })}
                          onWhatsApp={() => sendInvoiceWhatsApp(inv, lang)}
                        />
                        <Button variant="ghost" size="icon-sm" aria-label={t('edit')} title={t('edit')} onClick={() => setEditing(inv)}>
                          <Pencil />
                        </Button>
                        <Button variant="ghost" size="icon-sm" aria-label={t('delete')} title={t('delete')} onClick={() => setDeleting(inv)}>
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

      {editing && (
        <InvoiceModal doc={editing} customers={customers} quotations={quotations} onSave={save} onClose={() => setEditing(null)} />
      )}

      <ConfirmDialog
        open={!!deleting}
        title={t('sales_delete_inv_title')}
        description={deleting ? t('i18n_inv_delete_desc', { number: deleting.invNumber ?? '' }) : undefined}
        onConfirm={() => deleting && remove(deleting.id)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
