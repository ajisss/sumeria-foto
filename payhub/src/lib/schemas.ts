import { z } from 'zod'

/** Angka yang mungkin tersimpan sebagai string oleh aplikasi lama. */
const num = z.union([z.number(), z.string()]).transform((v) => (typeof v === 'number' ? v : Number(v) || 0))
const id = z.union([z.string(), z.number()]).transform(String)
const looseObj = <T extends z.ZodRawShape>(shape: T) => z.looseObject(shape)

export const CustomerSnapSchema = looseObj({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  city: z.string().optional(),
})

export const CustomerSchema = looseObj({
  id,
  name: z.string().optional().default(''),
  gender: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
})

export const DocItemSchema = looseObj({
  id: id.optional().default(''),
  eventDate: z.string().optional(),
  packageItem: z.string().optional(),
  description: z.string().optional(),
  qty: num.optional().default(0),
  unitPrice: num.optional().default(0),
  discount: num.optional(),
})

export const QuotationSchema = looseObj({
  id,
  quoNumber: z.string().optional(),
  date: z.string().optional(),
  customerId: z.string().optional(),
  customerSnap: CustomerSnapSchema.optional(),
  items: z.array(DocItemSchema).optional().default([]),
  notes: z.string().optional(),
  lastUpdated: z.string().optional(),
})

export const PaymentSchema = looseObj({
  id,
  label: z.string().optional().default(''),
  percent: num.optional().default(0),
  amount: num.optional().default(0),
  paid: z.boolean().optional().default(false),
  paidDate: z.string().nullable().optional().default(null),
})

export const InvoiceSchema = looseObj({
  id,
  invNumber: z.string().optional(),
  date: z.string().optional(),
  customerId: z.string().optional(),
  customerSnap: CustomerSnapSchema.optional(),
  items: z.array(DocItemSchema).optional().default([]),
  paymentPlan: z.enum(['2x', '3x', '4x', '5x']).optional().default('2x'),
  payments: z.array(PaymentSchema).optional().default([]),
  notes: z.string().optional(),
  lastUpdated: z.string().optional(),
  sourceQuotationId: z.string().optional(),
})

export const ExpenseSchema = looseObj({
  id,
  date: z.string().optional(),
  category: z.enum(['Project', 'Marketing', 'Asset', 'Salary', 'Other']).optional().default('Other'),
  invoiceId: z.string().optional(),
})

export const BackupFileSchema = looseObj({
  exportedAt: z.string().optional(),
  customers: z.array(z.unknown()),
  quotations: z.array(z.unknown()).optional().default([]),
  invoices: z.array(z.unknown()),
  expenses: z.array(z.unknown()).optional().default([]),
})

export type BackupData = {
  customers: unknown[]
  quotations: unknown[]
  invoices: unknown[]
  expenses: unknown[]
}

export type ParseBackupResult =
  | { ok: true; data: BackupData; exportedAt?: string; invalid: number }
  | { ok: false; issues: string[] }

const fmtIssue = (path: PropertyKey[], msg: string) => `${path.length ? path.map(String).join('.') : '(root)'}: ${msg}`

/**
 * Validasi file backup. Struktur (array) wajib benar; record yang tidak lolos skema
 * TIDAK diubah/dibuang dari data (agar tidak ada data hilang) tapi dihitung di `invalid`.
 */
export function parseBackup(json: unknown): ParseBackupResult {
  const top = BackupFileSchema.safeParse(json)
  if (!top.success) return { ok: false, issues: top.error.issues.map((i) => fmtIssue(i.path, i.message)) }
  const d = top.data
  let invalid = 0
  const check = (arr: unknown[], schema: z.ZodType) => {
    for (const r of arr) if (!schema.safeParse(r).success) invalid++
  }
  check(d.customers, CustomerSchema)
  check(d.quotations, QuotationSchema)
  check(d.invoices, InvoiceSchema)
  check(d.expenses, ExpenseSchema)
  return {
    ok: true,
    data: { customers: d.customers, quotations: d.quotations, invoices: d.invoices, expenses: d.expenses },
    exportedAt: d.exportedAt,
    invalid,
  }
}

/** Hitung record yang gagal validasi (tidak mengubah data). */
export function countInvalid(items: unknown[], schema: z.ZodType) {
  let n = 0
  for (const r of items) if (!schema.safeParse(r).success) n++
  return n
}
