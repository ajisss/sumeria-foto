import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { CustomerInfoPanel } from '@/components/app/customer-info-panel'
import { CustomerPicker } from '@/components/app/customer-picker'
import { ItemsEditor } from '@/components/app/items-editor'
import { docSubtotal } from '@/lib/calc'
import { fmtRp } from '@/lib/format'
import type { Customer, DocItem, Quotation } from '@/lib/types'
import { useT } from '@/i18n'
import { snapFromCustomer } from './doc-utils'
import { ACTION_ICONS } from '@/components/app/action-icons'

export type QuotationDraft = Partial<Quotation> & { items: DocItem[] }

interface Props {
  doc: QuotationDraft
  customers: Customer[]
  onSave: (doc: QuotationDraft) => void
  onClose: () => void
}

export function QuotationModal({ doc, customers, onSave, onClose }: Props) {
  const t = useT()
  const [form, setForm] = useState<QuotationDraft>(doc)
  const items = form.items
  const subtotal = docSubtotal(items)
  const customer = customers.find((c) => c.id === form.customerId)
  const invalid = !form.customerId || items.length === 0

  const pickCustomer = (id: string) =>
    setForm((f) => ({ ...f, customerId: id, customerSnap: snapFromCustomer(customers.find((c) => c.id === id)) }))

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{doc.id ? t('quo_modal_edit') : t('quo_modal_create')}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="quo-number">{t('quo_number')}</FieldLabel>
            <Input id="quo-number" value={form.quoNumber ?? ''} onChange={(e) => setForm((f) => ({ ...f, quoNumber: e.target.value }))} />
          </Field>
          <Field>
            <FieldLabel htmlFor="quo-date">{t('quo_date')}</FieldLabel>
            <Input id="quo-date" type="date" value={form.date ?? ''} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="quo-customer">{t('quo_pick_customer')}</FieldLabel>
          <CustomerPicker id="quo-customer" customers={customers} value={form.customerId ?? ''} onChange={pickCustomer} />
          {customers.length === 0 && <p className="text-sm text-destructive">{t('quo_no_customer_warning')}</p>}
        </Field>
        <CustomerInfoPanel customer={customer} onNavigate={onClose} />

        <div className="space-y-2">
          <div className="text-sm font-medium">{t('quo_items')}</div>
          <ItemsEditor items={items} setItems={(next) => setForm((f) => ({ ...f, items: next }))} />
        </div>

        <div className="flex justify-end gap-8 border-t pt-3">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">{t('quo_subtotal')}</div>
            <div className="text-base font-bold tabular-nums">{fmtRp(subtotal)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">{t('quo_dp')}</div>
            <div className="text-base font-bold tabular-nums text-primary">{fmtRp(subtotal * 0.3)}</div>
          </div>
        </div>

        <DialogFooter className="items-center">
          {invalid && <p className="mr-auto text-sm text-muted-foreground">{t('sales_items_required')}</p>}
          <Button type="button" variant="ghost" onClick={onClose}>
            <ACTION_ICONS.cancel />
            {t('cancel')}
          </Button>
          <Button type="button" disabled={invalid} onClick={() => onSave(form)}>
            <ACTION_ICONS.save />
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
