import { useMemo, useRef, useState, type TouchEvent } from 'react'
import { AlertTriangle, ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react'
import { EmptyState } from '@/components/app/empty-state'
import { PageHeader } from '@/components/app/page-header'
import { StatusBadge, type Tone } from '@/components/app/status-badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { currentStatus } from '@/lib/calc'
import { statusLabel } from '@/lib/doc-i18n'
import { fmtDate } from '@/lib/format'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n'
import { localISO } from './overview/dates'

interface DayEvent {
  invoiceId: string
  invNumber?: string
  customer?: string
  packageItem: string
  status: string | null
}

const statusTone = (s: string | null): Tone => (s === 'Paid Full' ? 'success' : s === null ? 'neutral' : 'warning')

export default function CalendarPage() {
  const { invoices, setTab, setSelectedInvoiceId } = useApp()
  const { t, lang } = useI18n()
  const now = new Date()
  const [cur, setCur] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [selected, setSelected] = useState<string | null>(null)
  const touchX = useRef<number | null>(null)
  const locale = lang === 'en' ? 'en-US' : 'id-ID'

  const weekdays = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' })
    // 2023-01-01 adalah hari Minggu
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2023, 0, 1 + i)))
  }, [locale])

  const byDate = useMemo(() => {
    const map: Record<string, DayEvent[]> = {}
    invoices.forEach((inv) => {
      const pkgs: Record<string, string[]> = {}
      ;(inv.items ?? []).forEach((it) => {
        if (!it.eventDate) return
        pkgs[it.eventDate] ??= []
        if (it.packageItem) pkgs[it.eventDate].push(it.packageItem)
      })
      Object.keys(pkgs).forEach((d) => {
        ;(map[d] ??= []).push({
          invoiceId: inv.id,
          invNumber: inv.invNumber,
          customer: inv.customerSnap?.name,
          packageItem: pkgs[d].join(', '),
          status: currentStatus(inv),
        })
      })
    })
    return map
  }, [invoices])

  const first = new Date(cur.y, cur.m, 1)
  const daysInMonth = new Date(cur.y, cur.m + 1, 0).getDate()
  const monthTitle = first.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
  const cells: (number | null)[] = [...Array<null>(first.getDay()).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const iso = (d: number) => `${cur.y}-${String(cur.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const today = localISO(now)

  function go(delta: number) {
    const d = new Date(cur.y, cur.m + delta, 1)
    setCur({ y: d.getFullYear(), m: d.getMonth() })
    setSelected(null)
  }
  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
  }

  const events = selected ? (byDate[selected] ?? []) : []

  return (
    <div className="space-y-4">
      <PageHeader title={t('cal_title')} subtitle={t('cal_subtitle')} />
      <Card
        className="touch-pan-y p-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => {
          touchX.current = null
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" title={t('cal_prev')} aria-label={t('cal_prev')} onClick={() => go(-1)}>
            <ChevronLeft />
          </Button>
          <h2 className="text-base font-semibold capitalize" aria-live="polite">
            {monthTitle}
          </h2>
          <Button variant="ghost" size="icon" title={t('cal_next')} aria-label={t('cal_next')} onClick={() => go(1)}>
            <ChevronRight />
          </Button>
        </div>
        <div className="mb-1.5 grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-muted-foreground sm:gap-2">
          {weekdays.map((w) => (
            <div key={w}>{w}</div>
          ))}
        </div>
        <div role="grid" aria-label={t('ov_cal_grid_aria', { month: monthTitle })} className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {cells.map((day, i) => {
            if (day === null) return <div key={`e${i}`} />
            const d = iso(day)
            const count = byDate[d]?.length ?? 0
            const has = count > 0
            const isToday = d === today
            return (
              <Button
                key={d}
                type="button"
                variant="outline"
                disabled={!has}
                aria-pressed={has ? d === selected : undefined}
                aria-label={t('ov_cal_day_aria', { date: fmtDate(d, lang), count })}
                onClick={() => setSelected(has ? d : null)}
                className={cn(
                  'aspect-square h-auto flex-col gap-0 p-0 disabled:opacity-100',
                  isToday && 'border-primary',
                  has && 'border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
                  d === selected && 'ring-[3px] ring-ring/50',
                )}
              >
                <span className={cn('text-sm', (has || isToday) && 'font-extrabold')}>{day}</span>
                {has && <span className="text-[10px] font-bold opacity-90">{count}</span>}
              </Button>
            )
          })}
        </div>
      </Card>

      {selected ? (
        <Card className="gap-3 p-4">
          <h3 className="text-sm font-semibold">
            {t('i18n_cal_events_on', { date: fmtDate(selected, lang), count: events.length })}
          </h3>
          {events.length > 1 && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-100 p-2.5 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300" role="alert">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
              {t('ov_cal_clash', { count: events.length })}
            </div>
          )}
          <ul className="divide-y">
            {events.map((ev, i) => (
              <li key={`${ev.invoiceId}-${i}`} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{ev.customer}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {ev.invNumber} — {ev.packageItem}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge tone={statusTone(ev.status)}>{statusLabel(ev.status, t)}</StatusBadge>
                  <Button
                    variant="ghost"
                    size="icon"
                    title={t('nav_orderDetails')}
                    aria-label={t('ov_orders_open_aria', { inv: ev.invNumber ?? '' })}
                    onClick={() => {
                      setSelectedInvoiceId(ev.invoiceId)
                      setTab('orderDetails')
                    }}
                  >
                    <ClipboardList />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <EmptyState text={t('cal_empty')} />
      )}
    </div>
  )
}
