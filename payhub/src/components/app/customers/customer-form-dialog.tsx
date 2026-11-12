import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useT } from '@/i18n'
import { ACTION_ICONS } from '@/components/app/action-icons'

export interface CustomerDraft {
  id?: string
  name: string
  gender?: string
  email?: string
  phone?: string
  city?: string
  [key: string]: unknown
}

interface Props {
  customer: CustomerDraft
  onSave: (c: CustomerDraft) => void
  onClose: () => void
}

export function CustomerFormDialog({ customer, onSave, onClose }: Props) {
  const t = useT()
  const [form, setForm] = useState<CustomerDraft>({
    ...customer,
    name: customer.name ?? '',
    gender: customer.gender ?? 'Female',
    email: customer.email ?? '',
    phone: customer.phone ?? '',
    city: customer.city ?? '',
  })
  const set = (key: 'name' | 'gender' | 'email' | 'phone' | 'city', value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (form.name) onSave(form)
          }}
        >
          <DialogHeader>
            <DialogTitle>{customer.id ? t('cust_modal_edit') : t('cust_modal_add')}</DialogTitle>
            <DialogDescription>{t('cust2_form_desc')}</DialogDescription>
          </DialogHeader>
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="cust-name">{t('cust_field_name')}</FieldLabel>
              <Input id="cust-name" value={form.name} onChange={(e) => set('name', e.target.value)} autoFocus required />
            </Field>
            <Field>
              <FieldLabel htmlFor="cust-gender">{t('cust_field_gender')}</FieldLabel>
              <Select value={form.gender ?? 'Female'} onValueChange={(v) => set('gender', v)}>
                <SelectTrigger id="cust-gender" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Female">{t('cust2_gender_female')}</SelectItem>
                  <SelectItem value="Male">{t('cust2_gender_male')}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="cust-email">{t('cust_field_email')}</FieldLabel>
              <Input id="cust-email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="cust-phone">{t('cust_field_phone')}</FieldLabel>
              <Input
                id="cust-phone"
                type="tel"
                inputMode="numeric"
                value={form.phone ?? ''}
                onChange={(e) => set('phone', e.target.value.replace(/[^0-9+]/g, ''))}
              />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="cust-city">{t('cust_field_city')}</FieldLabel>
              <Input id="cust-city" value={form.city ?? ''} onChange={(e) => set('city', e.target.value)} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              <ACTION_ICONS.cancel />
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={!form.name}>
              <ACTION_ICONS.save />
              {t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
