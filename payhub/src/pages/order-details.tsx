import { ClipboardList, Download, MessageCircle, Printer } from 'lucide-react'
import { EmptyState } from '@/components/app/empty-state'
import { PageHeader } from '@/components/app/page-header'
import { StatCard } from '@/components/app/stat-card'
import { StatusBadge } from '@/components/app/status-badge'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { docSubtotal, paidAmount } from '@/lib/calc'
import { stageLabel } from '@/lib/doc-i18n'
import { fmtDate, fmtRp } from '@/lib/format'
import { downloadInvoicePdf } from '@/lib/pdf'
import { sendInvoiceWhatsApp } from '@/lib/whatsapp'
import { useApp } from '@/lib/app-context'
import { useI18n } from '@/i18n'

const splitDescLines = (s?: string) =>
  (s ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)

export default function OrderDetailsPage() {
  const { invoices, selectedInvoiceId, setSelectedInvoiceId, setPrintTarget } = useApp()
  const { t, lang } = useI18n()
  const inv = invoices.find((i) => i.id === selectedInvoiceId) ?? invoices[0]

  const total = inv ? docSubtotal(inv.items) : 0
  const paid = inv ? paidAmount(inv) : 0
  const percent = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0

  return (
    <div className="space-y-4">
      <PageHeader
        title={t('od_title')}
        subtitle={t('od_subtitle')}
        action={
          inv && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setPrintTarget({ type: 'invoice', id: inv.id })}>
                <Printer />
                {t('ov_od_print')}
              </Button>
              <Button variant="outline" onClick={() => downloadInvoicePdf(inv, lang).catch(() => toast.error(t('print_pdf_error')))}>
                <Download />
                {t('print_menu_export')}
              </Button>
              <Button variant="outline" onClick={() => sendInvoiceWhatsApp(inv, lang)}>
                <MessageCircle />
                {t('print_menu_whatsapp')}
              </Button>
            </div>
          )
        }
      />

      <Card>
        <CardContent>
          <Field>
            <FieldLabel htmlFor="od-pick">{t('od_pick_invoice')}</FieldLabel>
            <Select value={inv?.id ?? ''} onValueChange={setSelectedInvoiceId}>
              <SelectTrigger id="od-pick" className="w-full">
                <SelectValue placeholder={t('od_pick_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {invoices.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.invNumber} — {i.customerSnap?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      {!inv ? (
        <EmptyState text={t('od_empty')} />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <ClipboardList className="size-4 text-muted-foreground" />
                {t('ov_od_summary')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-xs text-muted-foreground">{t('inv_number')}</dt>
                  <dd className="font-semibold">{inv.invNumber}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{t('ov_od_customer')}</dt>
                  <dd className="font-medium">{inv.customerSnap?.name ?? '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{t('ov_od_phone')}</dt>
                  <dd>{inv.customerSnap?.phone || '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{t('inv_date')}</dt>
                  <dd>{fmtDate(inv.date, lang)}</dd>
                </div>
                {inv.notes && (
                  <div className="sm:col-span-2 lg:col-span-4">
                    <dt className="text-xs text-muted-foreground">{t('ov_od_notes')}</dt>
                    <dd className="whitespace-pre-line">{inv.notes}</dd>
                  </div>
                )}
              </dl>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatCard label={t('ov_od_total')} value={fmtRp(total)} />
                <StatCard label={t('ov_od_paid')} value={fmtRp(paid)} tone="positive" />
                <StatCard label={t('ov_od_remaining')} value={fmtRp(total - paid)} tone={total - paid > 0 ? 'warning' : 'positive'} />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t('ov_od_progress')}</span>
                  <span>{t('ov_od_progress_label', { percent })}</span>
                </div>
                <Progress value={percent} aria-label={t('ov_od_progress')} />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-x-auto py-0">
            <div className="px-4 pt-4 text-sm font-semibold">{t('ov_od_payments')}</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('col_stage')}</TableHead>
                  <TableHead>{t('inv_col_pct')}</TableHead>
                  <TableHead>{t('col_amount')}</TableHead>
                  <TableHead>{t('col_status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(inv.payments ?? []).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{stageLabel(p.label, t)}</TableCell>
                    <TableCell>{Math.round(p.percent * 100) / 100}%</TableCell>
                    <TableCell>{fmtRp(p.amount)}</TableCell>
                    <TableCell>
                      <StatusBadge tone={p.paid ? 'success' : 'neutral'}>
                        {p.paid ? (p.paidDate ? t('ov_od_paid_on', { date: fmtDate(p.paidDate, lang) }) : t('inv_paid')) : t('inv_unpaid')}
                      </StatusBadge>
                    </TableCell>
                  </TableRow>
                ))}
                {(inv.payments ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-4 text-center text-muted-foreground">
                      {t('ov_od_no_payments')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          <Card className="overflow-x-auto py-0">
            <div className="px-4 pt-4 text-sm font-semibold">{t('ov_od_items')}</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">{t('item_no')}</TableHead>
                  <TableHead>{t('od_col_execdate')}</TableHead>
                  <TableHead>{t('item_package')}</TableHead>
                  <TableHead>{t('item_desc')}</TableHead>
                  <TableHead>{t('item_qty')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(inv.items ?? []).map((it, idx) => (
                  <TableRow key={it.id}>
                    <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell>{fmtDate(it.eventDate, lang)}</TableCell>
                    <TableCell>{it.packageItem}</TableCell>
                    <TableCell className="whitespace-normal">
                      {splitDescLines(it.description).map((line, i) => (
                        <div key={i}>• {line}</div>
                      ))}
                    </TableCell>
                    <TableCell>{it.qty}</TableCell>
                  </TableRow>
                ))}
                {(inv.items ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-4 text-center text-muted-foreground">
                      {t('od_no_items')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  )
}
