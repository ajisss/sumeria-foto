import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { EmptyState } from '@/components/app/empty-state'
import { fmtRp } from '@/lib/format'
import { useT } from '@/i18n'

export interface ChartRow {
  name: string
  Revenue: number
  Expense: number
  Profit: number
}

const axisFmt = (n: number, million: string) =>
  Math.abs(n) >= 1e6 ? `${(n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1)}${million}` : n.toLocaleString('id-ID')

const DOT: Record<string, string> = { Revenue: 'bg-blue-500', Expense: 'bg-slate-400', Profit: 'bg-emerald-500' }

export function RevenueBarChart({ data }: { data: ChartRow[] }) {
  const t = useT()
  if (data.length === 0) return <EmptyState text={t('dash_no_data')} />
  const config = {
    Revenue: { label: t('dash_revenue'), color: 'var(--color-blue-500)' },
    Expense: { label: t('dash_expenses'), color: 'var(--color-slate-400)' },
    Profit: { label: t('dash_profit'), color: 'var(--color-emerald-500)' },
  } satisfies ChartConfig
  return (
    <ChartContainer config={config} className="aspect-auto h-72 w-full" role="img" aria-label={t('ov_dash_chart_aria')}>
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={56} tickFormatter={(n: number) => axisFmt(n, t('i18n_axis_million'))} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(v, name) => (
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className={`size-2.5 rounded-[2px] ${DOT[String(name)] ?? ''}`} />
                    {config[name as keyof typeof config]?.label ?? name}
                  </span>
                  <span className="font-medium tabular-nums text-foreground">{fmtRp(Number(v))}</span>
                </div>
              )}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="Revenue" fill="var(--color-Revenue)" className="fill-blue-500" radius={3} />
        <Bar dataKey="Expense" fill="var(--color-Expense)" className="fill-slate-400" radius={3} />
        <Bar dataKey="Profit" fill="var(--color-Profit)" className="fill-emerald-500" radius={3} />
      </BarChart>
    </ChartContainer>
  )
}
