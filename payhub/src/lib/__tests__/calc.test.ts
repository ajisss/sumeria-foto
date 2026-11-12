import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addDays, computeOverdueInvoices, currentStatus, docSubtotal, generatePayments, isFullyPaid, lineTotal, nextNumber, sortRows, waPhone,
} from '../calc'
import type { Invoice, Payment, PlanKey } from '../types'

describe('lineTotal / docSubtotal', () => {
  it('applies discount', () => expect(lineTotal({ qty: 2, unitPrice: 1000, discount: 500 })).toBe(1500))
  it('accepts string numbers', () => expect(lineTotal({ qty: '3', unitPrice: '200', discount: '100' })).toBe(500))
  it('clamps negatives to 0', () => expect(lineTotal({ qty: 1, unitPrice: 100, discount: 500 })).toBe(0))
  it('treats garbage as 0', () => expect(lineTotal({ qty: 'x', unitPrice: 'y' })).toBe(0))
  it('sums items and handles undefined', () => {
    expect(docSubtotal([{ id: '1', qty: 1, unitPrice: 100 }, { id: '2', qty: 2, unitPrice: '50', discount: 10 }])).toBe(190)
    expect(docSubtotal(undefined)).toBe(0)
  })
})

describe('nextNumber', () => {
  const year = new Date().getFullYear()
  it('starts at 001', () => expect(nextNumber([], 'n', 'INV')).toBe(`INV/001/${year}`))
  it('filters by current year only', () => {
    expect(nextNumber([{ n: `INV/009/${year - 1}` }, { n: `INV/002/${year}` }], 'n', 'INV')).toBe(`INV/003/${year}`)
  })
  it('uses max, not count, with gaps', () => {
    expect(nextNumber([{ n: `INV/001/${year}` }, { n: `INV/007/${year}` }], 'n', 'INV')).toBe(`INV/008/${year}`)
  })
  it('pads and grows past 3 digits', () => {
    expect(nextNumber([{ n: `QUO/999/${year}` }], 'n', 'QUO')).toBe(`QUO/1000/${year}`)
  })
  it('ignores missing field', () => expect(nextNumber<{ n?: string }>([{}], 'n', 'INV')).toBe(`INV/001/${year}`))
})

describe('generatePayments', () => {
  const plans: PlanKey[] = ['2x', '3x', '4x', '5x']
  for (const plan of plans) {
    for (const total of [1000000, 1234567, 999, 1]) {
      it(`${plan} total ${total} sums exactly`, () => {
        const p = generatePayments(plan, total)
        expect(p).toHaveLength(Number(plan[0]))
        expect(p.reduce((s, x) => s + x.amount, 0)).toBe(total)
        expect(p.every((x) => !x.paid && x.paidDate === null)).toBe(true)
      })
    }
  }
  it('labels and percents', () => {
    const p = generatePayments('3x', 1000)
    expect(p.map((x) => x.label)).toEqual(['Down Payment', 'Second Payment', 'Paid Full'])
    expect(p.map((x) => x.percent)).toEqual([30, 35, 35])
  })
  it('last payment absorbs rounding', () => {
    const p = generatePayments('4x', 1001)
    const first = p.slice(0, -1).map((x) => x.amount)
    expect(first).toEqual(first.map((_, i) => Math.round((1001 * [30, 23.333, 23.333][i]) / 100)))
    expect(p[3].amount).toBe(1001 - first.reduce((a, b) => a + b, 0))
  })
  it('unique ids', () => expect(new Set(generatePayments('5x', 100).map((x) => x.id)).size).toBe(5))
})

const pay = (paid: boolean, label = 'x'): Payment => ({ id: label, label, percent: 0, amount: 0, paid, paidDate: null })

describe('currentStatus / isFullyPaid', () => {
  it('none paid', () => {
    expect(currentStatus({ payments: [pay(false)] })).toBeNull()
    expect(isFullyPaid({ payments: [pay(false)] })).toBe(false)
  })
  it('partial', () => {
    const inv = { payments: [pay(true, 'DP'), pay(false, 'Full')] }
    expect(currentStatus(inv)).toBe('DP')
    expect(isFullyPaid(inv)).toBe(false)
  })
  it('fully paid', () => {
    const inv = { payments: [pay(true, 'DP'), pay(true, 'Full')] }
    expect(currentStatus(inv)).toBe('Full')
    expect(isFullyPaid(inv)).toBe(true)
  })
  it('empty payments is not fully paid', () => expect(isFullyPaid({ payments: [] })).toBe(false))
})

describe('addDays', () => {
  it('adds and subtracts', () => {
    expect(addDays('2026-03-10', 5)).toBe('2026-03-15')
    expect(addDays('2026-03-10', -7)).toBe('2026-03-03')
  })
  it('crosses month/year', () => {
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })
})

describe('computeOverdueInvoices', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-10T12:00:00Z'))
  })
  afterEach(() => vi.useRealTimers())

  const mk = (id: string, eventDate: string | undefined, payments: Payment[], unit = 1000): Invoice => ({
    id,
    invNumber: id,
    customerSnap: { name: 'N' + id, phone: '08' },
    items: [{ id: 'i', qty: 1, unitPrice: unit, eventDate }],
    paymentPlan: '2x',
    payments,
  })

  it('H-7 boundary: today == deadline is NOT overdue, day after is', () => {
    // event 2026-06-17 -> deadline 2026-06-10 == today
    expect(computeOverdueInvoices([mk('a', '2026-06-17', [pay(false)])])).toHaveLength(0)
    const r = computeOverdueInvoices([mk('b', '2026-06-16', [pay(false)])])
    expect(r).toHaveLength(1)
    expect(r[0].deadline).toBe('2026-06-09')
    expect(r[0].daysOverdue).toBe(1)
  })
  it('excludes fully paid and no event date', () => {
    expect(computeOverdueInvoices([mk('a', '2026-01-01', [pay(false), pay(true)]), mk('b', undefined, [pay(false)])])).toHaveLength(0)
  })
  it('sorts by daysOverdue desc, uses earliest event date, computes remaining', () => {
    const inv = mk('b', '2026-05-01', [{ ...pay(true), amount: 300 }, pay(false)], 1000)
    inv.items.push({ id: 'j', qty: 1, unitPrice: 0, eventDate: '2026-04-01' })
    const r = computeOverdueInvoices([mk('a', '2026-06-01', [pay(false)]), inv])
    expect(r.map((x) => x.id)).toEqual(['b', 'a'])
    expect(r[0].eventDate).toBe('2026-04-01')
    expect(r[0].remaining).toBe(700)
  })
})

describe('waPhone', () => {
  it('normalises variants', () => {
    expect(waPhone('0812-3456 789')).toBe('628123456789')
    expect(waPhone('628123456789')).toBe('628123456789')
    expect(waPhone('+62 812 3456 789')).toBe('628123456789')
    expect(waPhone('8123456789')).toBe('628123456789')
    expect(waPhone(undefined)).toBe('62')
  })
})

describe('sortRows', () => {
  it('sorts numbers numerically', () => {
    expect(sortRows([{ v: 10 }, { v: 2 }, { v: 33 }], { key: 'v', dir: 'asc' }).map((r) => r.v)).toEqual([2, 10, 33])
    expect(sortRows([{ v: 10 }, { v: 2 }], { key: 'v', dir: 'desc' }).map((r) => r.v)).toEqual([10, 2])
  })
  it('sorts strings with numeric locale compare and does not mutate', () => {
    const rows = [{ s: 'INV/10' }, { s: 'INV/2' }, { s: undefined }]
    const out = sortRows(rows, { key: 's', dir: 'asc' }).map((r) => r.s)
    expect(out).toEqual([undefined, 'INV/2', 'INV/10'])
    expect(rows[0].s).toBe('INV/10')
  })
})
