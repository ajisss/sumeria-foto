import { useMemo, useState } from 'react'
import { Download, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ConfirmDialog } from '@/components/app/confirm-dialog'
import { EmptyState } from '@/components/app/empty-state'
import { PageHeader } from '@/components/app/page-header'
import { SearchInput } from '@/components/app/search-input'
import { SortableHead, type SortState } from '@/components/app/sortable-head'
import { CustomerDetailDialog } from '@/components/app/customers/customer-detail-dialog'
import { CustomerFormDialog, type CustomerDraft } from '@/components/app/customers/customer-form-dialog'
import { useApp } from '@/lib/app-context'
import { sortRows } from '@/lib/calc'
import { genderLabel } from '@/lib/doc-i18n'
import { exportCustomersXLS } from '@/lib/customers-xls'
import { uid } from '@/lib/format'
import type { Customer } from '@/lib/types'
import { useT } from '@/i18n'
import { ACTION_ICONS } from '@/components/app/action-icons'

export default function CustomersPage() {
  const t = useT()
  const { customers, setCustomers, detailCustomerId, setDetailCustomerId } = useApp()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortState>({ key: 'name', dir: 'asc' })
  const [editing, setEditing] = useState<CustomerDraft | null>(null)
  const [deleting, setDeleting] = useState<Customer | null>(null)

  const rows = useMemo(() => {
    const q = search.toLowerCase()
    return sortRows(
      customers.filter((c) => JSON.stringify(c).toLowerCase().includes(q)),
      sort,
    )
  }, [customers, search, sort])

  const detail = customers.find((c) => c.id === detailCustomerId)

  function save(c: CustomerDraft) {
    const isNew = !c.id
    setCustomers((prev) => (c.id ? prev.map((x) => (x.id === c.id ? (c as Customer) : x)) : [...prev, { ...c, id: uid() } as Customer]))
    setEditing(null)
    toast.success(isNew ? t('cust2_added') : t('cust2_updated'))
  }

  function remove(id: string) {
    setCustomers((prev) => prev.filter((c) => c.id !== id))
    setDeleting(null)
    toast.success(t('cust2_deleted'))
  }

  async function exportXls() {
    try {
      await exportCustomersXLS(customers, t)
      toast.success(t('cust2_exported'))
    } catch {
      toast.error(t('cust2_export_failed'))
    }
  }

  return (
    <div>
      <PageHeader
        title={t('cust_title')}
        subtitle={t('i18n_cust_subtitle', { count: customers.length })}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={exportXls}>
              <Download /> {t('cust_export_xls')}
            </Button>
            <Button onClick={() => setEditing({} as CustomerDraft)}>
              <Plus /> {t('cust_add')}
            </Button>
          </div>
        }
      />

      <Card className="mb-4">
        <CardContent>
          <SearchInput value={search} onChange={setSearch} placeholder={t('cust_search_placeholder')} />
        </CardContent>
      </Card>

      {rows.length === 0 ? (
        <EmptyState text={customers.length === 0 ? t('cust_empty') : t('cust2_no_results')} />
      ) : (
        <Card className="overflow-hidden py-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHead label={t('cust_col_name')} sortKey="name" sort={sort} setSort={setSort} />
                  <SortableHead label={t('cust_col_gender')} sortKey="gender" sort={sort} setSort={setSort} />
                  <SortableHead label={t('cust_col_email')} sortKey="email" sort={sort} setSort={setSort} />
                  <SortableHead label={t('cust_col_phone')} sortKey="phone" sort={sort} setSort={setSort} />
                  <SortableHead label={t('cust_col_city')} sortKey="city" sort={sort} setSort={setSort} />
                  <TableHead className="w-24">
                    <span className="sr-only">{t('cust2_actions')}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Button
                        variant="link"
                        className="h-auto p-0 font-semibold"
                        aria-label={t('cust2_view_detail', { name: c.name })}
                        onClick={() => setDetailCustomerId(c.id)}
                      >
                        <ACTION_ICONS.customer />
                        {c.name}
                      </Button>
                    </TableCell>
                    <TableCell>{genderLabel(c.gender, t)}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>{c.city}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" aria-label={t('cust2_edit_aria', { name: c.name })} onClick={() => setEditing(c)}>
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          aria-label={t('cust2_delete_aria', { name: c.name })}
                          onClick={() => setDeleting(c)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {editing && <CustomerFormDialog customer={editing} onSave={save} onClose={() => setEditing(null)} />}

      <ConfirmDialog
        open={!!deleting}
        title={t('cust2_delete_title')}
        description={deleting ? t('cust2_delete_desc', { name: deleting.name }) : undefined}
        onConfirm={() => deleting && remove(deleting.id)}
        onCancel={() => setDeleting(null)}
      />

      {detail && <CustomerDetailDialog customer={detail} onClose={() => setDetailCustomerId(null)} />}
    </div>
  )
}
