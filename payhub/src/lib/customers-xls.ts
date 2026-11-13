import type { Customer } from '@/lib/types'
import { genderLabel } from '@/lib/doc-i18n'
import { todayStr } from '@/lib/format'
import type { TFn } from '@/i18n'

/** Ekspor daftar customer ke file .xlsx (langsung diunduh). */
export async function exportCustomersXLS(customers: Customer[], t: TFn) {
  const XLSX = await import('xlsx')
  const rows = customers.map((c) => ({
    [t('cust_col_name')]: c.name,
    [t('cust_col_gender')]: genderLabel(c.gender, t),
    [t('cust_col_email')]: c.email,
    [t('cust_col_phone')]: c.phone,
    [t('cust_col_city')]: c.city,
  }))
  const sheet = XLSX.utils.json_to_sheet(rows)
  const book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, sheet, t('nav_customers'))
  XLSX.writeFile(book, `Sumeriapoto_Customers_${todayStr()}.xlsx`)
}
