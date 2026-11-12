import { describe, expect, it } from 'vitest'
import { buildLedger, computeMargins, type LedgerLabels } from '../finance'
import type { Expense, Invoice } from '../types'

const inv = (id: string, paid: [number, boolean, string | null][], date = '2026-01-01'): Invoice => ({
  id, invNumber: 'N' + id, date, customerSnap: { name: 'C' + id }, items: [], paymentPlan: '2x',
  payments: paid.map(([amount, p, paidDate], i) => ({ id: `${id}p${i}`, label: 'Down Payment', percent: 0, amount, paid: p, paidDate })),
})
const exp = (o: Partial<Expense> & { id: string }): Expense => ({ category: 'Project', ...o })
const labels: LedgerLabels = { stage: (s) => s, category: (c) => c, item: (n) => n, paymentDesc: (l) => 'Pay ' + l }

describe('computeMargins', () => {
  it('counts only paid revenue and Project expenses linked to the invoice', () => {
    const rows = computeMargins(
      [inv('a', [[1000, true, null], [500, false, null]]), inv('b', [])],
      [
        exp({ id: '1', invoiceId: 'a', qty: 2, unitPrice: 100 }),
        exp({ id: '2', invoiceId: 'a', category: 'Marketing', qty: 1, unitPrice: 999 }),
        exp({ id: '3', qty: 1, unitPrice: 999 }),
        exp({ id: '4', invoiceId: 'a', qty: '1', unitPrice: '50' }),
      ],
    )
    expect(rows[0]).toMatchObject({ revenue: 1000, expense: 250, profit: 750, margin: 75 })
    expect(rows[1]).toMatchObject({ revenue: 0, expense: 0, margin: 0 })
  })
})

describe('buildLedger', () => {
  it('orders by date, income before expense on ties, running balance over all', () => {
    const { rows, income, outflow } = buildLedger(
      [inv('a', [[1000, true, '2026-01-05'], [9, false, null]])],
      [exp({ id: 'e1', date: '2026-01-05', qty: 1, unitPrice: 300, invoiceId: 'a' }), exp({ id: 'e0', date: '2026-01-01', qty: 1, unitPrice: 100, category: 'Other' })],
      labels,
    )
    expect(income).toHaveLength(1)
    expect(outflow[0].invNo).toBe('Na')
    expect(rows.map((r) => [r.id, r.balance])).toEqual([['e0', -100], ['a:ap0', 900], ['e1', 600]])
  })
  it('income falls back to invoice date', () => {
    expect(buildLedger([inv('a', [[1, true, null]], '2026-02-02')], [], labels).rows[0].date).toBe('2026-02-02')
  })
})
