import { useMemo, useState } from 'react'
import { AlertTriangle, BarChart3, Receipt, TrendingUp, Wallet } from 'lucide-react'
import waIcon from '@/assets/wa-icon.png'
import { PageHeader } from '@/components/app/page-header'
import { StatCard } from '@/components/app/stat-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { lineTotal, openWhatsApp, reminderMessage } from '@/lib/calc'
import { fmtRp, monthKey, monthLabel } from '@/lib/format'
import { useApp } from '@/lib/app-context'
import type { Expense } from '@/lib/types'
import { useI18n } from '@/i18n'
import { periodRange, type Period } from './overview/dates'
import { RevenueBarChart, type ChartRow } from './overview/revenue-chart'

const expTotal = (e: Expense) => lineTotal({ qty: Number(e.qty), unitPrice: Number(e.unitPrice), discount: Number(e.discount) })

const PERIODS: Period[] = ['day', 'week', 'month', 'year', 'custom']

export default function DashboardPage() {
  const { invoices, expenses, overdueInvoices, setTab, setSelectedInvoiceId } = useApp()
  const { t, lang } = useI18n()
  const [period, setPeriod] = useState<Period>('month')
  const [view, setView] = useState<'month' | 'year'>('month')
  const [range, setRange] = useState(() => periodRange('month'))

  function choosePeriod(p: Period) {
    setPeriod(p)
    if (p !== 'custom') setRange(periodRange(p))
  }

  const payments = useMemo(
    () =>
      invoices.flatMap((inv) =>
        (inv.payments ?? []).filter((p) => p.paid).map((p) => ({ date: p.paidDate || inv.date || '', amount: p.amount })),
      ),
    [invoices],
  )

  const inRange = (d?: string) => !!d && d >= range.start && d <= range.end
  const paidIn = useMemo(() => payments.filter((p) => p.date >= range.start && p.date <= range.end), [payments, range])
  const expIn = useMemo(() => expenses.filter((e) => inRange(e.date)), [expenses, range]) // eslint-disable-line react-hooks/exhaustive-deps

  const revenue = paidIn.reduce((s, p) => s + p.amount, 0)
  const expenseTotal = expIn.reduce((s, e) => s + expTotal(e), 0)
  const assets = expIn
    .filter((e) => e.category === 'Asset')
    .reduce((s, e) => s + expTotal(e), 0)
  const profit = revenue - expenseTotal

  const chartData = useMemo<ChartRow[]>(() => {
    const keyOf = view === 'year' ? (d: string) => String(new Date(d).getFullYear()) : (d: string) => monthKey(d)
    const labelOf = view === 'year' ? (k: string) => k : (k: string) => monthLabel(k, lang)
    const acc: Record<string, { key: string; revenue: number; expense: number }> = {}
    const slot = (k: string) => (acc[k] ??= { key: k, revenue: 0, expense: 0 })
    paidIn.forEach((p) => {
      slot(keyOf(p.date)).revenue += p.amount
    })
    expIn.forEach((e) => {
      slot(keyOf(e.date as string)).expense += expTotal(e)
    })
    return Object.values(acc)
      .sort((a, b) => a.key.localeCompare(b.key))
      .map((r) => ({ name: labelOf(r.key), Revenue: r.revenue, Expense: r.expense, Profit: r.revenue - r.expense }))
  }, [paidIn, expIn, view, lang])

  return (
    <div className="space-y-4">
      <PageHeader title={t('nav_masterDashboard')} subtitle={t('dash_subtitle')} />

      {overdueInvoices.length > 0 && (
        <Card className="gap-0 overflow-hidden border-destructive/40 bg-destructive/5 py-0">
          <div className="flex items-center gap-2 border-b border-destructive/30 px-4 py-2.5 text-sm font-semibold text-destructive">
            <AlertTriangle className="size-4" />
            {t('i18n_dash_overdue_count', { count: overdueInvoices.length })}
          </div>
          <ul>
            {overdueInvoices.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 border-t border-destructive/20 px-4 py-2 first:border-t-0">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto min-w-0 flex-1 flex-col items-start justify-start whitespace-normal p-0 text-left hover:bg-transparent hover:underline"
                  aria-label={t('ov_dash_overdue_aria', { inv: o.invNumber ?? '' })}
                  onClick={() => {
                    setSelectedInvoiceId(o.id)
                    setTab('orderDetails')
                  }}
                >
                  <span className="block truncate text-sm font-semibold">
                    {o.invNumber} — {o.customer}
                  </span>
                  <span className="block text-xs text-destructive">
                    {fmtRp(o.remaining)} · {t('i18n_dash_days_late', { days: o.daysOverdue })}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title={t('dash_send_reminder')}
                  aria-label={t('ov_dash_reminder_aria', { inv: o.invNumber ?? '' })}
                  onClick={() => openWhatsApp(o.phone, reminderMessage(o, lang))}
                >
                  <img src={waIcon} alt="" className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3">
          <Tabs value={period} onValueChange={(v) => choosePeriod(v as Period)}>
            <TabsList aria-label={t('ov_dash_period')}>
              {PERIODS.map((p) => (
                <TabsTrigger key={p} value={p}>
                  {t(`dash_${p}` as const)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex items-end gap-2">
            <Field className="w-40">
              <FieldLabel htmlFor="dash-from">{t('ov_dash_from')}</FieldLabel>
              <Input
                id="dash-from"
                type="date"
                value={range.start}
                onChange={(e) => {
                  setPeriod('custom')
                  setRange((r) => ({ ...r, start: e.target.value }))
                }}
              />
            </Field>
            <Field className="w-40">
              <FieldLabel htmlFor="dash-to">{t('ov_dash_to')}</FieldLabel>
              <Input
                id="dash-to"
                type="date"
                value={range.end}
                onChange={(e) => {
                  setPeriod('custom')
                  setRange((r) => ({ ...r, end: e.target.value }))
                }}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('dash_revenue')} value={fmtRp(revenue)} icon={TrendingUp} />
        <StatCard label={t('dash_expenses')} value={fmtRp(expenseTotal)} icon={Receipt} />
        <StatCard label={t('dash_assets')} value={fmtRp(assets)} icon={Wallet} />
        <StatCard label={t('dash_profit')} value={fmtRp(profit)} icon={BarChart3} tone={profit >= 0 ? 'positive' : 'negative'} />
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <BarChart3 className="size-4 text-muted-foreground" />
            {t('dash_chart_title')}
          </CardTitle>
          <Tabs value={view} onValueChange={(v) => setView(v as 'month' | 'year')}>
            <TabsList aria-label={t('ov_dash_chart_view')}>
              <TabsTrigger value="month">{t('dash_monthly')}</TabsTrigger>
              <TabsTrigger value="year">{t('dash_yearly')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <RevenueBarChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  )
}
