import { useMemo, useRef, useState } from 'react'
import { Download, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ConfirmDialog } from '@/components/app/confirm-dialog'
import { currentStatus, docSubtotal, lineTotal } from '@/lib/calc'
import { categoryLabel, expenseItemLabel, stageLabel, statusLabel } from '@/lib/doc-i18n'
import { monthLabelLong, todayStr } from '@/lib/format'
import type { Customer, Expense, Invoice, Quotation } from '@/lib/types'
import { parseBackup } from '@/lib/schemas'
import { useI18n, type TFn } from '@/i18n'
import { toast } from 'sonner'

interface Data {
  customers: Customer[]
  quotations: Quotation[]
  invoices: Invoice[]
  expenses: Expense[]
}

interface Props extends Data {
  open: boolean
  onClose: () => void
  onRestore: (d: Data) => void
  onBackedUp: () => void
}

function collectMonths({ quotations, invoices, expenses }: Data) {
  const set = new Set<string>()
  quotations.forEach((q) => q.date && set.add(q.date.slice(0, 7)))
  invoices.forEach((inv) => {
    if (inv.date) set.add(inv.date.slice(0, 7))
    ;(inv.payments ?? []).forEach((p) => p.paid && set.add((p.paidDate || inv.date || todayStr()).slice(0, 7)))
  })
  expenses.forEach((e) => e.date && set.add(e.date.slice(0, 7)))
  set.add(todayStr().slice(0, 7))
  return Array.from(set).sort().reverse()
}

async function exportMonthlyXLS(d: Data, month: string, t: TFn) {
  const XLSX = await import('xlsx')
  const inMonth = (s?: string | null) => !!s && s.slice(0, 7) === month
  const income = d.invoices.flatMap((inv) =>
    (inv.payments ?? [])
      .filter((p) => p.paid && inMonth(p.paidDate || inv.date))
      .map((p) => ({
        [t('col_date')]: p.paidDate || inv.date,
        [t('col_invoice_no')]: inv.invNumber,
        [t('quo_col_customer')]: inv.customerSnap?.name ?? '',
        [t('col_stage')]: stageLabel(p.label, t),
        [t('col_amount')]: p.amount,
      })),
  )
  const expenses = d.expenses.filter((e) => inMonth(e.date)).map((e) => ({
    [t('col_date')]: e.date,
    [t('ledger_col_category')]: categoryLabel(e.category, t),
    [t('exp_field_item')]: expenseItemLabel(e.itemName as string, t),
    [t('exp_field_qty')]: e.qty as number,
    [t('exp_field_unitprice')]: e.unitPrice as number,
    [t('col_total')]: lineTotal(e as unknown as { qty: number; unitPrice: number }),
  }))
  const invoices = d.invoices.filter((i) => inMonth(i.date)).map((i) => ({
    [t('col_invoice_no')]: i.invNumber,
    [t('col_date')]: i.date,
    [t('quo_col_customer')]: i.customerSnap?.name ?? '',
    [t('col_total')]: docSubtotal(i.items),
    [t('col_status')]: statusLabel(currentStatus(i), t),
  }))
  const quotations = d.quotations.filter((q) => inMonth(q.date)).map((q) => ({
    [t('col_quotation_no')]: q.quoNumber,
    [t('col_date')]: q.date,
    [t('quo_col_customer')]: q.customerSnap?.name ?? '',
    [t('col_subtotal')]: docSubtotal(q.items),
    [t('quo_col_dp')]: docSubtotal(q.items) * 0.3,
  }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(income), t('ledger_income'))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(expenses), t('nav_expenses'))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(invoices), t('nav_invoices'))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(quotations), t('nav_quotations'))
  XLSX.writeFile(wb, `Sumeriapoto-Backup-${month}.xlsx`)
}

export function BackupDialog({ open, onClose, onRestore, onBackedUp, ...data }: Props) {
  const { t, lang } = useI18n()
  const fileRef = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<Data | null>(null)
  const months = useMemo(() => collectMonths(data), [data.quotations, data.invoices, data.expenses]) // eslint-disable-line react-hooks/exhaustive-deps
  const [month, setMonth] = useState(months[0])

  function exportFull() {
    const payload = { exportedAt: new Date().toISOString(), ...data }
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `Sumeriapoto-Backup-Lengkap-${todayStr()}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    onBackedUp()
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const res = parseBackup(JSON.parse(String(reader.result)))
        if (!res.ok) {
          toast.error(`${t('backup_invalid')} ${t('val_backup_issues', { issues: res.issues.slice(0, 3).join('; ') })}`)
          return
        }
        setPending(res.data as unknown as Data)
        if (res.invalid > 0) toast.warning(t('val_backup_dropped', { count: res.invalid }))
      } catch {
        toast.error(t('backup_invalid'))
      }
    }
    reader.readAsText(file)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('backup_title')}</DialogTitle>
            <DialogDescription>{t('backup_monthly_hint')}</DialogDescription>
          </DialogHeader>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-medium">{t('backup_monthly_title')}</h3>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>
                    {monthLabelLong(m, lang)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={async () => {
                await exportMonthlyXLS(data, month, t)
                onBackedUp()
              }}
            >
              <Download />
              {t('backup_monthly_button')}
            </Button>
          </section>

          <Separator />

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-medium">{t('backup_full_title')}</h3>
            <p className="text-sm text-muted-foreground">{t('backup_full_hint')}</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={exportFull}>
                <Download />
                {t('backup_full_export')}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => fileRef.current?.click()}>
                <Upload />
                {t('backup_full_restore')}
              </Button>
            </div>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onFile} />
          </section>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!pending}
        title={t('backup_confirm_title')}
        description={
          pending
            ? t('backup_confirm_body', {
                customers: pending.customers.length,
                quotations: pending.quotations.length,
                invoices: pending.invoices.length,
                expenses: pending.expenses.length,
              })
            : undefined
        }
        confirmLabel={t('backup_confirm_yes')}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending) onRestore(pending)
          setPending(null)
          onClose()
        }}
      />
    </>
  )
}
