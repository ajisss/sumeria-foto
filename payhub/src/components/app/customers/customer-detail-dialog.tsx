import { useMemo } from 'react'
import { FileText, Receipt, TrendingUp, Wallet } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/app/empty-state'
import { StatCard } from '@/components/app/stat-card'
import { StatusBadge, type Tone } from '@/components/app/status-badge'
import { useApp } from '@/lib/app-context'
import { currentStatus, docSubtotal, sortRows } from '@/lib/calc'
import { genderLabel, stageLabel, statusLabel } from '@/lib/doc-i18n'
import { fmtDate, fmtRp } from '@/lib/format'
import type { Customer } from '@/lib/types'
import { useI18n } from '@/i18n'

interface PaymentRow {
  date: string
  label: string
  amount: number
  invNumber: string
}

function statusTone(status: string | null): Tone {
  if (status === 'Paid Full') return 'success'
  if (status === null) return 'neutral'
  return 'warning'
}

export function CustomerDetailDialog({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const { t, lang } = useI18n()
  const { quotations, invoices } = useApp()

  const { quos, invs, payments, revenue, outstanding } = useMemo(() => {
    const quos = sortRows(
      quotations.filter((q) => q.customerId === customer.id).map((q) => ({ ...q, subtotal: docSubtotal(q.items) })),
      { key: 'date', dir: 'desc' },
    )
    const invs = sortRows(
      invoices
        .filter((i) => i.customerId === customer.id)
        .map((i) => ({ ...i, total: docSubtotal(i.items), status: currentStatus(i) })),
      { key: 'date', dir: 'desc' },
    )
    const payments: PaymentRow[] = []
    for (const inv of invs) {
      for (const p of inv.payments ?? []) {
        if (p.paid) {
          payments.push({ date: p.paidDate || inv.date || '', label: p.label, amount: p.amount, invNumber: inv.invNumber ?? '' })
        }
      }
    }
    payments.sort((a, b) => (a.date > b.date ? -1 : 1))
    const revenue = payments.reduce((s, p) => s + p.amount, 0)
    const total = invs.reduce((s, i) => s + i.total, 0)
    return { quos, invs, payments, revenue, outstanding: Math.max(0, total - revenue) }
  }, [quotations, invoices, customer.id])

  const info: [string, string | undefined][] = [
    [t('detail_gender'), genderLabel(customer.gender, t)],
    [t('detail_phone'), customer.phone],
    [t('detail_email'), customer.email],
    [t('detail_city'), customer.city],
  ]

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{customer.name}</DialogTitle>
          <DialogDescription>{t('cust2_detail_desc')}</DialogDescription>
        </DialogHeader>

        <dl className="grid gap-x-4 gap-y-1 rounded-lg border bg-muted/40 px-4 py-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {info.map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className="inline text-muted-foreground">{label}: </dt>
              <dd className="inline break-words font-semibold">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label={t('detail_revenue')} value={fmtRp(revenue)} tone="positive" icon={TrendingUp} />
          <StatCard label={t('detail_outstanding')} value={fmtRp(outstanding)} tone={outstanding > 0 ? 'warning' : 'default'} icon={Wallet} />
          <StatCard label={t('detail_quotations')} value={String(quos.length)} icon={FileText} />
          <StatCard label={t('detail_invoices')} value={String(invs.length)} icon={Receipt} />
        </div>

        <section className="grid gap-2">
          <h3 className="text-sm font-semibold">{t('detail_invoice_history')}</h3>
          {invs.length === 0 ? (
            <EmptyState text={t('detail_no_invoice')} />
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('col_invoice_no')}</TableHead>
                    <TableHead>{t('col_date')}</TableHead>
                    <TableHead>{t('col_total')}</TableHead>
                    <TableHead>{t('col_status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invs.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell className="font-semibold">{i.invNumber}</TableCell>
                      <TableCell>{fmtDate(i.date, lang)}</TableCell>
                      <TableCell>{fmtRp(i.total)}</TableCell>
                      <TableCell>
                        <StatusBadge tone={statusTone(i.status)}>{statusLabel(i.status, t)}</StatusBadge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>

        <section className="grid gap-2">
          <h3 className="text-sm font-semibold">{t('detail_quotation_history')}</h3>
          {quos.length === 0 ? (
            <EmptyState text={t('detail_no_quotation')} />
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('col_quotation_no')}</TableHead>
                    <TableHead>{t('col_date')}</TableHead>
                    <TableHead>{t('col_subtotal')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quos.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-semibold">{q.quoNumber}</TableCell>
                      <TableCell>{fmtDate(q.date, lang)}</TableCell>
                      <TableCell>{fmtRp(q.subtotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>

        <section className="grid gap-2">
          <h3 className="text-sm font-semibold">{t('detail_payment_history')}</h3>
          {payments.length === 0 ? (
            <EmptyState text={t('detail_no_payment')} />
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('col_date')}</TableHead>
                    <TableHead>{t('col_invoice_no')}</TableHead>
                    <TableHead>{t('col_stage')}</TableHead>
                    <TableHead>{t('col_amount')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p, idx) => (
                    <TableRow key={`${p.invNumber}-${p.label}-${idx}`}>
                      <TableCell>{fmtDate(p.date, lang)}</TableCell>
                      <TableCell className="font-semibold">{p.invNumber}</TableCell>
                      <TableCell>{stageLabel(p.label, t)}</TableCell>
                      <TableCell className="font-bold text-emerald-600 dark:text-emerald-400">{fmtRp(p.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </DialogContent>
    </Dialog>
  )
}
