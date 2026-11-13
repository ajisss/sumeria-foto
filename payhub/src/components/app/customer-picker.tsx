import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useApp } from '@/lib/app-context'
import { uid } from '@/lib/format'
import type { Customer } from '@/lib/types'
import { useT } from '@/i18n'
import { ACTION_ICONS } from '@/components/app/action-icons'

interface Props {
  customers: Customer[]
  value: string
  onChange: (customerId: string) => void
  id?: string
}

const blank = { name: '', gender: 'Female', email: '', phone: '', city: '' }

/** Pilih customer + tombol tambah customer cepat. */
export function CustomerPicker({ customers, value, onChange, id }: Props) {
  const t = useT()
  const { setCustomers } = useApp()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(blank)

  const set = (k: keyof typeof blank, v: string) => setForm((f) => ({ ...f, [k]: v }))

  function save() {
    const customer: Customer = { id: uid(), ...form, name: form.name.trim() }
    setCustomers((prev) => [...prev, customer])
    onChange(customer.id)
    setOpen(false)
    setForm(blank)
    toast.success(t('sales_customer_saved'))
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={t('pick_customer_placeholder')} />
        </SelectTrigger>
        <SelectContent>
          {customers.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="button" variant="outline" size="icon" aria-label={t('sales_add_customer')} title={t('sales_add_customer')} onClick={() => setOpen(true)}>
        <UserPlus />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('sales_quick_add_title')}</DialogTitle>
            <DialogDescription>{t('sales_quick_add_desc')}</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="qa-name">{t('cust_field_name')}</FieldLabel>
              <Input id="qa-name" value={form.name} onChange={(e) => set('name', e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="qa-gender">{t('cust_field_gender')}</FieldLabel>
              <Select value={form.gender} onValueChange={(v) => set('gender', v)}>
                <SelectTrigger id="qa-gender" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Female">{t('sales_gender_female')}</SelectItem>
                  <SelectItem value="Male">{t('sales_gender_male')}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="qa-email">{t('cust_field_email')}</FieldLabel>
              <Input id="qa-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="qa-phone">{t('cust_field_phone')}</FieldLabel>
              <Input
                id="qa-phone"
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value.replace(/[^0-9+]/g, ''))}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="qa-city">{t('cust_field_city')}</FieldLabel>
              <Input id="qa-city" value={form.city} onChange={(e) => set('city', e.target.value)} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              <ACTION_ICONS.cancel />
              {t('cancel')}
            </Button>
            <Button type="button" disabled={!form.name.trim()} onClick={save}>
              <ACTION_ICONS.save />
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
