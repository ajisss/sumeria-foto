import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfirmDialog } from '@/components/app/confirm-dialog'
import { EmptyState } from '@/components/app/empty-state'
import { PageHeader } from '@/components/app/page-header'
import { SearchInput } from '@/components/app/search-input'
import { SortableHead, type SortState } from '@/components/app/sortable-head'
import { useApp } from '@/lib/app-context'
import { lineTotal, sortRows } from '@/lib/calc'
import { expenseItemLabel } from '@/lib/doc-i18n'
import { CATEGORIES } from '@/lib/constants'
import { fmtDate, fmtRp } from '@/lib/format'
import type { ExpenseCategory } from '@/lib/types'
import { useI18n } from '@/i18n'
import { ExpenseForm } from './finance/expense-form'

interface ExpenseListRow extends Record<string, unknown> {
  id: string
  date?: string
  category: ExpenseCategory
  invoiceId?: string
  itemName: string
  qty: number
  unitPrice: number
  total: number
  invNo: string
}

export default function ExpensesPage() {
  const { t, lang } = useI18n()
  const { expenses, setExpenses, invoices } = useApp()
  const [category, setCategory] = useState<ExpenseCategory>('Project')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortState>({ key: 'date', dir: 'desc' })
  const [toDelete, setToDelete] = useState<ExpenseListRow | null>(null)

  const isSalary = category === 'Salary'
  const isProject = category === 'Project'
  const catLabel = t(`fin_cat_${category}`)

  const rows: ExpenseListRow[] = expenses.map((x) => ({
    ...x,
    itemName: String(x.itemName ?? ''),
    qty: Number(x.qty) || 0,
    unitPrice: Number(x.unitPrice) || 0,
    total: lineTotal({ qty: Number(x.qty) || 0, unitPrice: Number(x.unitPrice) || 0 }),
    invNo: invoices.find((inv) => inv.id === x.invoiceId)?.invNumber || '',
  }))
  const visible = sortRows(
    rows.filter((x) => x.category === category).filter((x) => JSON.stringify(x).toLowerCase().includes(query.toLowerCase())),
    sort,
  )

  function remove(row: ExpenseListRow) {
    setExpenses((cur) => cur.filter((x) => x.id !== row.id))
    setToDelete(null)
    toast.success(t('fin_deleted'))
  }

  return (
    <div className="space-y-4">
      <PageHeader title={t('exp_title')} subtitle={t('exp_subtitle')} />

      <Tabs value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
        <TabsList aria-label={t('fin_categories_aria')} className="h-auto flex-wrap">
          {CATEGORIES.map((c) => (
            <TabsTrigger key={c} value={c}>
              {t(`fin_cat_${c}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <ExpenseForm key={category} category={category} />

      <SearchInput value={query} onChange={setQuery} />

      <Card className="overflow-x-auto p-0">
        {visible.length === 0 ? (
          <EmptyState text={t('fin_empty', { category: catLabel.toLowerCase() })} />
        ) : (
          <Table aria-label={t('fin_list_aria')}>
            <TableHeader>
              <TableRow>
                <SortableHead label={t(isSalary ? 'exp_field_month' : 'col_date')} sortKey="date" sort={sort} setSort={setSort} />
                {isProject && <TableHead>{t('exp_col_invoice')}</TableHead>}
                <TableHead>{t(isSalary ? 'exp_field_name' : 'exp_field_item')}</TableHead>
                {!isSalary && <SortableHead label={t('exp_field_qty')} sortKey="qty" sort={sort} setSort={setSort} />}
                <SortableHead
                  label={t(isSalary ? 'exp_field_salary' : 'exp_field_unitprice')}
                  sortKey="unitPrice"
                  sort={sort}
                  setSort={setSort}
                />
                <SortableHead label={t('exp_field_total')} sortKey="total" sort={sort} setSort={setSort} />
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((x) => (
                <TableRow key={x.id}>
                  <TableCell>{fmtDate(x.date, lang)}</TableCell>
                  {isProject && <TableCell>{x.invNo}</TableCell>}
                  <TableCell>{expenseItemLabel(x.itemName, t)}</TableCell>
                  {!isSalary && <TableCell className="tabular-nums">{x.qty}</TableCell>}
                  <TableCell className="tabular-nums">{fmtRp(x.unitPrice)}</TableCell>
                  <TableCell className="font-semibold tabular-nums">{fmtRp(x.total)}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive"
                      aria-label={t('fin_delete_expense_aria', { item: expenseItemLabel(x.itemName, t) })}
                      onClick={() => setToDelete(x)}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <ConfirmDialog
        open={toDelete !== null}
        title={t('delete')}
        description={t('exp_delete_confirm')}
        onConfirm={() => toDelete && remove(toDelete)}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}
