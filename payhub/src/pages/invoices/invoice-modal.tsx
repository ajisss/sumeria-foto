import { useMemo, useState } from 'react'
import { Check, CircleDashed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { CustomerInfoPanel } from '@/components/app/customer-info-panel'
import { CustomerPicker } from '@/components/app/customer-picker'
import { ItemsEditor } from '@/components/app/items-editor'
import { docSubtotal, generatePayments, sortRows } from '@/lib/calc'
import { stageLabel } from '@/lib/doc-i18n'
import { fmtDate, fmtRp, todayStr, uid } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Customer, DocItem, Invoice, Payment, PlanKey, Quotation } from '@/lib/types'
import { useI18n } from '@/i18n'
import { snapFromCustomer } from '../quotations/doc-utils'
import { ACTION_ICONS } from '@/components/app/action-icons'

export type InvoiceDraft = Partial<Invoice> & { items: DocItem[] }

const PLANS: PlanKey[] = ['2x', '3x', '4x', '5x']

/** Hitung ulang nominal tiap termin dari persentase; selisih pembulatan masuk ke termin terakhir. */
function recalcPayments(payments: Payment[], total: number): Payment[] {
  const amounts = payments.map((p) => Math.round((total * Number(p.percent)) / 100))
  if (amounts.length) amounts[amounts.length - 1] += total - amounts.reduce((a, b) => a + b, 0)
  return payments.map((p, i) => ({ ...p, amount: amounts[i] }))
}

interface Props {
  doc: InvoiceDraft
  customers: Customer[]
  quotations: Quotation[]
  onSave: (doc: InvoiceDraft) => void
  onClose: () => void
}

export function InvoiceModal({ doc, customers, quotations, onSave, onClose }: Props) {
  const { t, lang } = useI18n()
  const [form, setForm] = useState<InvoiceDraft>(doc)
  const [items, setItemsState] = useState<DocItem[]>(doc.items)
  const [plan, setPlan] = useState<PlanKey>(doc.paymentPlan ?? '2x')
  const [payments, setPayments] = useState<Payment[]>(() =>
    doc.payments && doc.payments.length ? doc.payments : generatePayments(doc.paymentPlan ?? '2x', docSubtotal(doc.items)),
  )

  const total = docSubtotal(items)
  const customer = customers.find((c) => c.id === form.customerId)
  const invalid = !form.customerId || items.length === 0

  const customerQuos = useMemo(
    () =>
      sortRows(
        quotations.filter((q) => q.customerId === form.customerId).map((q) => ({ ...q, subtotal: docSubtotal(q.items) })),
        { key: 'date', dir: 'desc' },
      ),
    [quotations, form.customerId],
  )

  function applyItems(next: DocItem[]) {
    setItemsState(next)
    setPayments((p) => (p.length ? recalcPayments(p, docSubtotal(next)) : generatePayments(plan, docSubtotal(next))))
  }

  const pickCustomer = (id: string) =>
    setForm((f) => ({ ...f, customerId: id, customerSnap: snapFromCustomer(customers.find((c) => c.id === id)) }))

  function fillFromQuotation(id: string) {
    const q = quotations.find((x) => x.id === id)
    if (q) applyItems((q.items ?? []).map((it) => ({ ...it, id: uid() })))
  }

  function changePlan(p: PlanKey) {
    setPlan(p)
    setPayments(generatePayments(p, total))
  }

  const togglePaid = (index: number) =>
    setPayments((prev) => prev.map((p, i) => (i === index ? { ...p, paid: !p.paid, paidDate: p.paid ? null : todayStr() } : p)))

  const latest = customerQuos[0]

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{doc.id ? t('inv_modal_edit') : t('inv_modal_create')}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="inv-number">{t('inv_number')}</FieldLabel>
            <Input id="inv-number" value={form.invNumber ?? ''} onChange={(e) => setForm((f) => ({ ...f, invNumber: e.target.value }))} />
          </Field>
          <Field>
            <FieldLabel htmlFor="inv-date">{t('inv_date')}</FieldLabel>
            <Input id="inv-date" type="date" value={form.date ?? ''} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="inv-customer">{t('quo_pick_customer')}</FieldLabel>
          <CustomerPicker id="inv-customer" customers={customers} value={form.customerId ?? ''} onChange={pickCustomer} />
          {customers.length === 0 && <p className="text-sm text-destructive">{t('quo_no_customer_warning')}</p>}
        </Field>
        <CustomerInfoPanel customer={customer} onNavigate={onClose} />

        {latest && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/50 px-3.5 py-2.5">
            <div className="text-sm">
              {t('inv_fill_from_quo_hint')} <b>{latest.quoNumber}</b> ({fmtDate(latest.date, lang)}, {fmtRp(latest.subtotal)})
            </div>
            <div className="flex items-center gap-2">
              {customerQuos.length > 1 && (
                <Select value="" onValueChange={fillFromQuotation}>
                  <SelectTrigger size="sm" aria-label={t('inv_pick_other_quo')}>
                    <SelectValue placeholder={t('inv_pick_other_quo')} />
                  </SelectTrigger>
                  <SelectContent>
                    {customerQuos.map((q) => (
                      <SelectItem key={q.id} value={q.id}>
                        {q.quoNumber} — {fmtDate(q.date, lang)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button type="button" size="sm" onClick={() => fillFromQuotation(latest.id)}>
                <ACTION_ICONS.fill />
                {t('inv_fill_from_quo_btn')}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-sm font-medium">{t('quo_items')}</div>
          <ItemsEditor items={items} setItems={applyItems} />
        </div>

        <Field>
          <FieldLabel htmlFor="inv-plan">{t('inv_payment_plan')}</FieldLabel>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={plan} onValueChange={(v) => changePlan(v as PlanKey)}>
              <SelectTrigger id="inv-plan" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLANS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {t('sales_plan_option', { n: p.replace('x', '') })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {t('inv_current_subtotal')} <b className="text-foreground">{fmtRp(total)}</b>
            </span>
          </div>
        </Field>

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('inv_col_stage')}</TableHead>
                <TableHead>{t('inv_col_pct')}</TableHead>
                <TableHead>{t('inv_col_amount')}</TableHead>
                <TableHead>{t('inv_col_paid')}</TableHead>
                <TableHead>{t('sales_col_paid_date')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p, i) => (
                <TableRow key={p.id || i}>
                  <TableCell className="font-semibold">{stageLabel(p.label, t)}</TableCell>
                  <TableCell className="tabular-nums">{Number(p.percent).toFixed(1)}%</TableCell>
                  <TableCell className="tabular-nums">{fmtRp(p.amount)}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      aria-pressed={p.paid}
                      aria-label={t('sales_toggle_paid', { stage: stageLabel(p.label, t) })}
                      className={cn(p.paid && 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300')}
                      onClick={() => togglePaid(i)}
                    >
                      {p.paid ? <Check /> : <CircleDashed />}
                      {p.paid ? t('inv_paid') : t('inv_unpaid')}
                    </Button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.paid ? fmtDate(p.paidDate, lang) : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Field>
          <FieldLabel htmlFor="inv-notes">{t('inv_notes')}</FieldLabel>
          <Textarea id="inv-notes" value={form.notes ?? ''} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        </Field>

        <DialogFooter className="items-center">
          {invalid && <p className="mr-auto text-sm text-muted-foreground">{t('sales_items_required')}</p>}
          <Button type="button" variant="ghost" onClick={onClose}>
            <ACTION_ICONS.cancel />
            {t('cancel')}
          </Button>
          <Button type="button" disabled={invalid} onClick={() => onSave({ ...form, items, paymentPlan: plan, payments })}>
            <ACTION_ICONS.save />
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
