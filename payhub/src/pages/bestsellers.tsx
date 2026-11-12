import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/app/page-header'
import { EmptyState } from '@/components/app/empty-state'
import { SortableHead, type SortState } from '@/components/app/sortable-head'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { lineTotal, sortRows } from '@/lib/calc'
import { fmtRp } from '@/lib/format'
import { useApp } from '@/lib/app-context'
import { useT } from '@/i18n'

interface Row extends Record<string, unknown> {
  packageItem: string
  qty: number
  orders: number
  revenue: number
}

export default function BestsellersPage() {
  const { invoices } = useApp()
  const t = useT()
  const [sort, setSort] = useState<SortState>({ key: 'revenue', dir: 'desc' })

  const rows = useMemo(() => {
    const acc: Record<string, Row> = {}
    invoices.forEach((inv) =>
      (inv.items ?? []).forEach((it) => {
        const name = it.packageItem || ''
        const r = (acc[name] ??= { packageItem: name, qty: 0, orders: 0, revenue: 0 })
        r.qty += Number(it.qty) || 0
        r.orders += 1
        r.revenue += lineTotal(it)
      }),
    )
    return Object.values(acc)
  }, [invoices])

  const sorted = sortRows(rows, sort) as Row[]
  const max = Math.max(1, ...sorted.map((r) => r.revenue))

  return (
    <div>
      <PageHeader title={t('best_title')} subtitle={t('best_subtitle')} />
      {sorted.length === 0 ? (
        <EmptyState text={t('best_empty')} />
      ) : (
        <Card className="overflow-x-auto py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <SortableHead label={t('best_col_package')} sortKey="packageItem" sort={sort} setSort={setSort} />
                <SortableHead label={t('best_col_qty')} sortKey="qty" sort={sort} setSort={setSort} />
                <SortableHead label={t('best_col_orders')} sortKey="orders" sort={sort} setSort={setSort} />
                <SortableHead label={t('best_col_revenue')} sortKey="revenue" sort={sort} setSort={setSort} />
                <TableHead className="min-w-36">{t('best_col_share')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((r, i) => {
                const pct = Math.round((r.revenue / max) * 100)
                return (
                  <TableRow key={r.packageItem}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{r.packageItem || t('ov_best_unnamed')}</TableCell>
                    <TableCell>{r.qty}</TableCell>
                    <TableCell>{r.orders}</TableCell>
                    <TableCell className="font-semibold">{fmtRp(r.revenue)}</TableCell>
                    <TableCell>
                      <Progress value={pct} aria-label={t('ov_best_share_aria', { percent: pct })} className="h-2 min-w-24" />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
