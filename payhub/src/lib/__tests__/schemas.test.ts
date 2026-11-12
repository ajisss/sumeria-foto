import { describe, expect, it } from 'vitest'
import { CustomerSchema, DocItemSchema, ExpenseSchema, InvoiceSchema, PaymentSchema, QuotationSchema, parseBackup } from '../schemas'

const invoice = {
  id: 'abc123xyz',
  invNumber: 'INV/001/2025',
  date: '2025-01-02',
  customerSnap: { name: 'Budi', phone: '0812' },
  items: [{ id: 'i1', qty: '2', unitPrice: '1500000', discount: '0', eventDate: '2025-02-01', extra: 'keep' }],
  paymentPlan: '2x',
  payments: [
    { id: 'p1', label: 'Down Payment', percent: 30, amount: '450000', paid: true, paidDate: '2025-01-03' },
    { id: 'p2', label: 'Paid Full', percent: 70, amount: 1050000, paid: false, paidDate: null },
  ],
  legacyField: 1,
}

describe('schemas (legacy fixtures)', () => {
  it('parses customer with unknown keys', () => {
    const r = CustomerSchema.parse({ id: 'x1', name: 'A', foo: 'bar' })
    expect(r.foo).toBe('bar')
  })
  it('coerces numeric strings in items', () => {
    const r = DocItemSchema.parse(invoice.items[0])
    expect(r.qty).toBe(2)
    expect(r.unitPrice).toBe(1500000)
    expect(r.extra).toBe('keep')
  })
  it('parses invoice incl. nullable paidDate and string amount', () => {
    const r = InvoiceSchema.parse(invoice)
    expect(r.payments[0].amount).toBe(450000)
    expect(r.payments[1].paidDate).toBeNull()
    expect(r.legacyField).toBe(1)
  })
  it('parses minimal quotation, expense, payment', () => {
    expect(QuotationSchema.safeParse({ id: 'q' }).success).toBe(true)
    expect(ExpenseSchema.safeParse({ id: 'e', category: 'Project', qty: '2', unitPrice: 5 }).success).toBe(true)
    expect(PaymentSchema.safeParse({ id: 'p', paid: true }).success).toBe(true)
  })
  it('rejects garbage', () => {
    expect(CustomerSchema.safeParse(null).success).toBe(false)
    expect(CustomerSchema.safeParse('str').success).toBe(false)
    expect(InvoiceSchema.safeParse({ id: 'x', items: 'nope' }).success).toBe(false)
    expect(ExpenseSchema.safeParse({ id: 'e', category: 'Bogus' }).success).toBe(false)
    expect(InvoiceSchema.safeParse({ items: [] }).success).toBe(false)
  })
})

describe('parseBackup', () => {
  it('accepts a valid backup', () => {
    const r = parseBackup({ exportedAt: '2025-01-01', customers: [{ id: 'c', name: 'A' }], quotations: [], invoices: [invoice], expenses: [] })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.invalid).toBe(0)
      expect(r.data.invoices).toHaveLength(1)
    }
  })
  it('defaults missing optional arrays', () => {
    const r = parseBackup({ customers: [], invoices: [] })
    expect(r.ok && r.data.quotations).toEqual([])
    expect(r.ok && r.data.expenses).toEqual([])
  })
  it('fails when required arrays missing', () => {
    const r = parseBackup({ customers: [] })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.issues.some((i) => i.includes('invoices'))).toBe(true)
  })
  it('fails on wrong types and non-objects', () => {
    expect(parseBackup({ customers: 'x', invoices: {} }).ok).toBe(false)
    expect(parseBackup(null).ok).toBe(false)
    expect(parseBackup([]).ok).toBe(false)
  })
  it('counts but keeps invalid records', () => {
    const r = parseBackup({ customers: [{ id: 'c' }, 42], invoices: [] })
    expect(r.ok && r.invalid).toBe(1)
    expect(r.ok && r.data.customers).toHaveLength(2)
  })
})
