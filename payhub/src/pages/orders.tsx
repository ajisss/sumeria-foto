import { useMemo, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { PageHeader } from '@/components/app/page-header'
import { EmptyState } from '@/components/app/empty-state'
import { SearchInput } from '@/components/app/search-input'
import { SortableHead, type SortState } from '@/components/app/sortable-head'
import { StatusBadge } from '@/components/app/status-badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { docSubtotal, isFullyPaid, sortRows } from '@/lib/calc'
import { fmtRp } from '@/lib/format'
import { useApp } from '@/lib/app-context'
import type { Invoice } from '@/lib/types'
import { useT } from '@/i18n'

type Row = Invoice & { total: number; paid: boolean }

export default function OrdersPage() {
  const { invoices, setInvoices, setTab, setSelectedInvoiceId } = useApp()
  const t = useT()
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<SortState>({ key: 'date', dir: 'desc' })

  const rows = useMemo(() => {
    const all: Row[] = invoices.map((inv) => ({ ...inv, total: docSubtotal(inv.items), paid: isFullyPaid(inv) }))
    const needle = q.toLowerCase()
    return sortRows(
      all.filter((r) => JSON.stringify(r).toLowerCase().includes(needle)),
      sort,
    ) as Row[]
  }, [invoices, q, sort])

  const open = (id: string) => {
    setSelectedInvoiceId(id)
    setTab('orderDetails')
  }

  const saveNote = (id: string, notes: string) =>
    setInvoices((list) => list.map((inv) => (inv.id === id && (inv.notes ?? '') !== notes ? { ...inv, notes } : inv)))

  return (
    <div className="space-y-4">
      <PageHeader title={t('orders_title')} subtitle={t('orders_subtitle')} />
      <SearchInput value={q} onChange={setQ} />
      {rows.length === 0 ? (
        <EmptyState text={t('orders_empty')} />
      ) : (
        <Card className="overflow-x-auto py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHead label={t('inv_number')} sortKey="invNumber" sort={sort} setSort={setSort} />
                <TableHead>{t('quo_col_customer')}</TableHead>
                <SortableHead label={t('orders_col_total')} sortKey="total" sort={sort} setSort={setSort} />
                <TableHead>{t('col_status')}</TableHead>
                <TableHead className="min-w-52">{t('orders_col_note')}</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} className="cursor-pointer" onClick={() => open(r.id)}>
                  <TableCell className="font-semibold">{r.invNumber}</TableCell>
                  <TableCell>{r.customerSnap?.name}</TableCell>
                  <TableCell>{fmtRp(r.total)}</TableCell>
                  <TableCell>
                    <StatusBadge tone={r.paid ? 'success' : 'warning'}>{r.paid ? t('status_paid_full') : t('status_not_paid')}</StatusBadge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Input
                      key={`${r.id}-${r.notes ?? ''}`}
                      defaultValue={r.notes ?? ''}
                      placeholder={t('orders_note_placeholder')}
                      aria-label={t('ov_orders_note_label', { inv: r.invNumber ?? '' })}
                      onBlur={(e) => saveNote(r.id, e.target.value)}
                    />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      title={t('nav_orderDetails')}
                      aria-label={t('ov_orders_open_aria', { inv: r.invNumber ?? '' })}
                      onClick={() => open(r.id)}
                    >
                      <ClipboardList />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
