import { useState } from 'react'
import { BarChart3, Receipt, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/app/empty-state'
import { PageHeader } from '@/components/app/page-header'
import { SearchInput } from '@/components/app/search-input'
import { SortableHead, type SortState } from '@/components/app/sortable-head'
import { StatCard } from '@/components/app/stat-card'
import { useApp } from '@/lib/app-context'
import { sortRows } from '@/lib/calc'
import { computeMargins } from '@/lib/finance'
import { fmtRp } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useT } from '@/i18n'

type MarginTone = 'positive' | 'warning' | 'negative'

export function marginTone(pct: number): MarginTone {
  return pct >= 35 ? 'positive' : pct >= 25 ? 'warning' : 'negative'
}

const barClass: Record<MarginTone, string> = {
  positive: '[&_[data-slot=progress-indicator]]:bg-emerald-500',
  warning: '[&_[data-slot=progress-indicator]]:bg-amber-500',
  negative: '[&_[data-slot=progress-indicator]]:bg-destructive',
}
const textClass: Record<MarginTone, string> = {
  positive: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  negative: 'text-destructive',
}

export default function MarginPage() {
  const t = useT()
  const { invoices, expenses } = useApp()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortState>({ key: 'profit', dir: 'desc' })

  const all = computeMargins(invoices, expenses)
  const rows = sortRows(all.filter((r) => JSON.stringify(r).toLowerCase().includes(query.toLowerCase())), sort)

  const revenue = all.reduce((s, r) => s + r.revenue, 0)
  const expense = all.reduce((s, r) => s + r.expense, 0)
  const profit = revenue - expense
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0

  return (
    <div className="space-y-4">
      <PageHeader title={t('margin_title')} subtitle={t('margin_subtitle')} />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label={t('margin_total_revenue')} value={fmtRp(revenue)} icon={TrendingUp} />
        <StatCard label={t('margin_total_expense')} value={fmtRp(expense)} icon={Receipt} />
        <StatCard
          label={t('margin_total_profit')}
          value={fmtRp(profit)}
          tone={revenue > 0 ? marginTone(margin) : profit >= 0 ? 'positive' : 'negative'}
          hint={revenue > 0 ? t('fin_margin_hint', { percent: margin.toFixed(1) }) : undefined}
          icon={BarChart3}
        />
      </div>

      <SearchInput value={query} onChange={setQuery} />

      <Card className="overflow-x-auto p-0">
        {rows.length === 0 ? (
          <EmptyState text={t('margin_empty')} />
        ) : (
          <Table aria-label={t('fin_margin_aria')}>
            <TableHeader>
              <TableRow>
                <SortableHead label={t('inv_number')} sortKey="invNumber" sort={sort} setSort={setSort} />
                <SortableHead label={t('quo_col_customer')} sortKey="customer" sort={sort} setSort={setSort} />
                <SortableHead label={t('dash_revenue')} sortKey="revenue" sort={sort} setSort={setSort} />
                <SortableHead label={t('margin_col_expense')} sortKey="expense" sort={sort} setSort={setSort} />
                <SortableHead label={t('margin_col_profit')} sortKey="profit" sort={sort} setSort={setSort} />
                <TableHead className="min-w-36">{t('margin_col_margin')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const tone = marginTone(r.margin)
                const pct = Math.max(0, Math.min(100, Math.abs(r.margin)))
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-semibold">{r.invNumber}</TableCell>
                    <TableCell>{r.customer}</TableCell>
                    <TableCell className="font-semibold tabular-nums">{fmtRp(r.revenue)}</TableCell>
                    <TableCell className="font-semibold tabular-nums">{fmtRp(r.expense)}</TableCell>
                    <TableCell className={cn('font-bold tabular-nums', r.profit >= 0 ? textClass.positive : textClass.negative)}>
                      {fmtRp(r.profit)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={pct}
                          aria-label={t('fin_margin_bar_aria', { percent: r.margin.toFixed(0) })}
                          className={cn('min-w-12 flex-1', barClass[tone])}
                        />
                        <span className={cn('text-xs font-bold whitespace-nowrap tabular-nums', textClass[tone])}>
                          {r.margin.toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
