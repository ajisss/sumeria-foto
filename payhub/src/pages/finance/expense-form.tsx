import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CurrencyInput } from '@/components/app/currency-input'
import { useApp } from '@/lib/app-context'
import { MARKETING_ITEMS, PROJECT_ITEMS } from '@/lib/constants'
import { expenseItemLabel } from '@/lib/doc-i18n'
import { fmtRp, todayStr, uid } from '@/lib/format'
import type { Expense, ExpenseCategory } from '@/lib/types'
import { useT } from '@/i18n'
import { ACTION_ICONS } from '@/components/app/action-icons'

interface Row {
  rid: string
  itemName: string
  customName: string
  qty: string
  unitPrice: number
}

export function presetItems(cat: ExpenseCategory): readonly string[] | null {
  return cat === 'Project' ? PROJECT_ITEMS : cat === 'Marketing' ? MARKETING_ITEMS : null
}

function blankRow(cat: ExpenseCategory): Row {
  return { rid: uid(), itemName: presetItems(cat)?.[0] ?? '', customName: '', qty: '1', unitPrice: 0 }
}

const rowTotal = (r: Row) => Math.max(0, (Number(r.qty) || 0) * (Number(r.unitPrice) || 0))

/** Form input multi-baris pengeluaran untuk satu kategori. Remount (key=category) saat kategori berganti. */
export function ExpenseForm({ category }: { category: ExpenseCategory }) {
  const t = useT()
  const { invoices, setExpenses } = useApp()
  const [date, setDate] = useState(todayStr())
  const [invoiceId, setInvoiceId] = useState('')
  const [rows, setRows] = useState<Row[]>(() => [blankRow(category)])

  const presets = presetItems(category)
  const isSalary = category === 'Salary'
  const isProject = category === 'Project'
  const total = rows.reduce((sum, r) => sum + rowTotal(r), 0)

  const patch = (i: number, p: Partial<Row>) => setRows((cur) => cur.map((r, n) => (n === i ? { ...r, ...p } : r)))

  function save() {
    if (isProject && !invoiceId) return
    const valid = rows
      .map((r) => ({ ...r, itemName: r.itemName === 'Others' ? r.customName || 'Others' : r.itemName }))
      .filter((r) => r.itemName)
    if (!valid.length) return
    const created: Expense[] = valid.map((r) => ({
      id: uid(),
      date,
      category,
      invoiceId: isProject ? invoiceId : '',
      itemName: r.itemName,
      qty: Number(r.qty) || 0,
      unitPrice: r.unitPrice,
    }))
    setExpenses((cur) => [...cur, ...created])
    setRows([blankRow(category)])
    toast.success(t('fin_saved'))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {t('fin_input_title', { category: t(`fin_cat_${category}`) })}
          {isProject && <span className="ml-1 font-normal text-muted-foreground">{t('exp_input_hint')}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="exp-date">{t(isSalary ? 'exp_field_month' : 'exp_field_date')}</FieldLabel>
            {isSalary ? (
              <Input
                id="exp-date"
                type="month"
                value={date.slice(0, 7)}
                onChange={(e) => setDate(e.target.value ? `${e.target.value}-01` : todayStr())}
              />
            ) : (
              <Input id="exp-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            )}
          </Field>
          {isProject && (
            <Field>
              <FieldLabel htmlFor="exp-invoice">{t('exp_field_invoice')}</FieldLabel>
              <Select value={invoiceId} onValueChange={setInvoiceId}>
                <SelectTrigger id="exp-invoice" className="w-full">
                  <SelectValue placeholder={t('exp_pick_invoice')} />
                </SelectTrigger>
                <SelectContent>
                  {invoices.map((inv) => (
                    <SelectItem key={inv.id} value={inv.id}>
                      {inv.invNumber} — {inv.customerSnap?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        </div>

        <div className="overflow-x-auto rounded-md border">
          <Table aria-label={t('fin_items_aria')}>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">{t('item_no')}</TableHead>
                <TableHead className="min-w-52">{t(isSalary ? 'exp_field_name' : 'exp_field_item')}</TableHead>
                {!isSalary && <TableHead className="w-24">{t('exp_field_qty')}</TableHead>}
                <TableHead className="w-40">{t(isSalary ? 'exp_field_salary' : 'exp_field_unitprice')}</TableHead>
                <TableHead className="w-36">{t('exp_field_total')}</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={r.rid}>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  <TableCell>
                    {presets ? (
                      <div className="flex gap-2">
                        <Select value={r.itemName} onValueChange={(v) => patch(i, { itemName: v })}>
                          <SelectTrigger className="min-w-44 flex-1" aria-label={t('fin_row_item_aria', { n: i + 1 })}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {presets.map((p) => (
                              <SelectItem key={p} value={p}>
                                {expenseItemLabel(p, t)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {r.itemName === 'Others' && (
                          <Input
                            aria-label={t('fin_row_custom_aria', { n: i + 1 })}
                            placeholder={t('exp_custom_placeholder')}
                            value={r.customName}
                            onChange={(e) => patch(i, { customName: e.target.value })}
                          />
                        )}
                      </div>
                    ) : (
                      <Input
                        aria-label={t('fin_row_item_aria', { n: i + 1 })}
                        placeholder={t(isSalary ? 'exp_salary_placeholder' : 'exp_custom_placeholder2')}
                        value={r.itemName}
                        onChange={(e) => patch(i, { itemName: e.target.value })}
                      />
                    )}
                  </TableCell>
                  {!isSalary && (
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        aria-label={t('fin_row_qty_aria', { n: i + 1 })}
                        value={r.qty}
                        onChange={(e) => patch(i, { qty: e.target.value })}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <CurrencyInput
                      aria-label={t('fin_row_price_aria', { n: i + 1 })}
                      value={r.unitPrice}
                      onChange={(v) => patch(i, { unitPrice: v })}
                    />
                  </TableCell>
                  <TableCell className="font-semibold tabular-nums">{fmtRp(rowTotal(r))}</TableCell>
                  <TableCell>
                    {rows.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive"
                        aria-label={t('fin_remove_row', { n: i + 1 })}
                        onClick={() => setRows((cur) => cur.filter((_, n) => n !== i))}
                      >
                        <Trash2 />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={() => setRows((cur) => [...cur, blankRow(category)])}>
            <Plus /> {t('exp_add_row')}
          </Button>
          <p className="text-sm text-muted-foreground">
            {t('item_subtotal')}: <b className="text-foreground tabular-nums">{fmtRp(total)}</b>
          </p>
        </div>

        <Button type="button" onClick={save} disabled={isProject && !invoiceId}>
          <ACTION_ICONS.save />
          {t('exp_save_all')}
        </Button>
      </CardContent>
    </Card>
  )
}
