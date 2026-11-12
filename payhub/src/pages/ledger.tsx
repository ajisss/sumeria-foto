import { useMemo, useState } from 'react'
import { Receipt, Trash2, TrendingUp, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ConfirmDialog } from '@/components/app/confirm-dialog'
import { EmptyState } from '@/components/app/empty-state'
import { PageHeader } from '@/components/app/page-header'
import { SearchInput } from '@/components/app/search-input'
import { SortableHead, type SortState } from '@/components/app/sortable-head'
import { StatCard } from '@/components/app/stat-card'
import { StatusBadge } from '@/components/app/status-badge'
import { useApp } from '@/lib/app-context'
import { sortRows } from '@/lib/calc'
import { ledgerIncome, ledgerOutflow, withRunningBalance, type LedgerEntry, type LedgerLabels } from '@/lib/finance'
import { categoryLabel, expenseItemLabel, stageLabel } from '@/lib/doc-i18n'
import { fmtDate, fmtRp } from '@/lib/format'
import { useI18n } from '@/i18n'

type TypeFilter = 'All' | 'Income' | 'Expense'

export default function LedgerPage() {
  const { t, lang } = useI18n()
  const { invoices, setInvoices, expenses, setExpenses } = useApp()
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All')
  const [sort, setSort] = useState<SortState>({ key: 'date', dir: 'asc' })
  const [toDelete, setToDelete] = useState<(LedgerEntry & { balance: number }) | null>(null)

  const labels = useMemo<LedgerLabels>(
    () => ({
      stage: (l) => stageLabel(l, t),
      category: (c) => categoryLabel(c, t),
      item: (n) => expenseItemLabel(n, t),
      paymentDesc: (l) => t('fin_payment_desc', { label: l }),
    }),
    [t],
  )
  const income = useMemo(() => ledgerIncome(invoices, labels), [invoices, labels])
  const outflow = useMemo(() => ledgerOutflow(expenses, invoices, labels), [expenses, invoices, labels])
  // Saldo berjalan dihitung kronologis atas SEMUA transaksi, lalu difilter/diurutkan untuk tampilan.
  const withBalance = useMemo(() => withRunningBalance(income, outflow), [income, outflow])

  const q = query.toLowerCase()
  const visible = sortRows(
    withBalance.filter((e) => typeFilter === 'All' || e.type === typeFilter).filter((e) => JSON.stringify(e).toLowerCase().includes(q)),
    sort,
  )

  const totalIncome = income.reduce((s, e) => s + e.amount, 0)
  const totalExpense = outflow.reduce((s, e) => s + e.amount, 0)

  function confirmDelete(e: LedgerEntry) {
    if (e.type === 'Income') {
      setInvoices((cur) =>
        cur.map((inv) =>
          inv.id === e.invoiceId
            ? { ...inv, payments: inv.payments.map((p) => (p.id === e.paymentId ? { ...p, paid: false, paidDate: null } : p)) }
            : inv,
        ),
      )
      toast.success(t('fin_ledger_unpaid'))
    } else {
      setExpenses((cur) => cur.filter((x) => x.id !== e.id))
      toast.success(t('fin_ledger_deleted'))
    }
    setToDelete(null)
  }

  const isIncomeDelete = toDelete?.type === 'Income'

  return (
    <div className="space-y-4">
      <PageHeader title={t('ledger_title')} subtitle={t('ledger_subtitle')} />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label={t('ledger_total_income')} value={fmtRp(totalIncome)} tone="positive" icon={TrendingUp} />
        <StatCard label={t('ledger_total_expense')} value={fmtRp(totalExpense)} icon={Receipt} />
        <StatCard label={t('ledger_balance')} value={fmtRp(totalIncome - totalExpense)} icon={Wallet} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={query} onChange={setQuery} />
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
          <SelectTrigger className="w-40" aria-label={t('fin_type_filter_aria')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">{t('ledger_all_types')}</SelectItem>
            <SelectItem value="Income">{t('ledger_income')}</SelectItem>
            <SelectItem value="Expense">{t('ledger_expense')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-x-auto p-0">
        {visible.length === 0 ? (
          <EmptyState text={t('ledger_empty')} />
        ) : (
          <Table aria-label={t('fin_ledger_aria')}>
            <TableHeader>
              <TableRow>
                <SortableHead label={t('col_date')} sortKey="date" sort={sort} setSort={setSort} />
                <TableHead>{t('ledger_col_invoice')}</TableHead>
                <TableHead>{t('ledger_col_type')}</TableHead>
                <TableHead>{t('ledger_col_category')}</TableHead>
                <TableHead>{t('ledger_col_desc')}</TableHead>
                <TableHead>{t('ledger_col_income')}</TableHead>
                <TableHead>{t('ledger_col_expense')}</TableHead>
                <TableHead>{t('ledger_col_balance')}</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{fmtDate(e.date, lang)}</TableCell>
                  <TableCell>{e.invNo || '-'}</TableCell>
                  <TableCell>
                    <StatusBadge tone={e.type === 'Income' ? 'success' : 'danger'}>
                      {e.type === 'Income' ? t('ledger_income') : t('ledger_expense')}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{e.category}</TableCell>
                  <TableCell>{e.description}</TableCell>
                  <TableCell className="font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                    {e.type === 'Income' ? fmtRp(e.amount) : ''}
                  </TableCell>
                  <TableCell className="font-bold tabular-nums text-destructive">{e.type === 'Expense' ? fmtRp(e.amount) : ''}</TableCell>
                  <TableCell className="font-bold tabular-nums">{fmtRp(e.balance)}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive"
                      aria-label={t('fin_delete_row_aria', { item: e.description })}
                      onClick={() => setToDelete(e)}
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
        title={t(isIncomeDelete ? 'fin_unpay_title' : 'delete')}
        description={isIncomeDelete ? t('fin_unpay_confirm') : t('exp_delete_confirm')}
        confirmLabel={isIncomeDelete ? t('fin_unpay_action') : undefined}
        onConfirm={() => toDelete && confirmDelete(toDelete)}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}
