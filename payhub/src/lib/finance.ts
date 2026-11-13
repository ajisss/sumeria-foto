import { lineTotal } from './calc'
import type { Expense, Invoice } from './types'

export interface MarginRow extends Record<string, unknown> {
  id: string
  invNumber: string
  customer: string
  revenue: number
  expense: number
  profit: number
  margin: number
}

/** Margin per invoice: pendapatan = termin lunas, biaya = pengeluaran kategori 'Project' yang terhubung ke invoice. */
export function computeMargins(invoices: Invoice[], expenses: Expense[]): MarginRow[] {
  return invoices.map((inv) => {
    const revenue = (inv.payments || []).filter((p) => p.paid).reduce((s, p) => s + p.amount, 0)
    const expense = expenses
      .filter((x) => x.category === 'Project' && x.invoiceId === inv.id)
      .reduce((s, x) => s + lineTotal({ qty: Number(x.qty) || 0, unitPrice: Number(x.unitPrice) || 0 }), 0)
    const profit = revenue - expense
    return {
      id: inv.id,
      invNumber: inv.invNumber || '',
      customer: inv.customerSnap?.name || '',
      revenue,
      expense,
      profit,
      margin: revenue > 0 ? (profit / revenue) * 100 : 0,
    }
  })
}

export interface LedgerEntry extends Record<string, unknown> {
  id: string
  date: string
  invNo: string
  type: 'Income' | 'Expense'
  category: string
  description: string
  amount: number
  invoiceId?: string
  paymentId?: string
}

export interface LedgerLabels {
  stage: (label: string) => string
  category: (category: string) => string
  item: (name: string) => string
  paymentDesc: (stageLabel: string) => string
}

export function ledgerIncome(invoices: Invoice[], labels: LedgerLabels): LedgerEntry[] {
  const out: LedgerEntry[] = []
  invoices.forEach((inv) =>
    (inv.payments || []).forEach((p) => {
      if (!p.paid) return
      out.push({
        id: `${inv.id}:${p.id}`,
        date: p.paidDate || inv.date || '',
        invNo: inv.invNumber || '',
        type: 'Income',
        category: labels.stage(p.label),
        description: labels.paymentDesc(labels.stage(p.label)),
        amount: p.amount,
        invoiceId: inv.id,
        paymentId: p.id,
      })
    }),
  )
  return out
}

export function ledgerOutflow(expenses: Expense[], invoices: Invoice[], labels: LedgerLabels): LedgerEntry[] {
  return expenses.map((x) => ({
    id: x.id,
    date: x.date || '',
    invNo: (x.invoiceId && invoices.find((inv) => inv.id === x.invoiceId)?.invNumber) || '',
    type: 'Expense' as const,
    category: labels.category(x.category),
    description: labels.item(String(x.itemName ?? '')),
    amount: lineTotal({ qty: Number(x.qty) || 0, unitPrice: Number(x.unitPrice) || 0 }),
  }))
}

/** Saldo berjalan kronologis atas semua transaksi (sort stabil: income lebih dulu pada tanggal sama). */
export function withRunningBalance(income: LedgerEntry[], outflow: LedgerEntry[]) {
  let running = 0
  return [...income, ...outflow]
    .sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0))
    .map((e) => {
      running += e.type === 'Income' ? e.amount : -e.amount
      return { ...e, balance: running }
    })
}

export function buildLedger(invoices: Invoice[], expenses: Expense[], labels: LedgerLabels) {
  const income = ledgerIncome(invoices, labels)
  const outflow = ledgerOutflow(expenses, invoices, labels)
  return { income, outflow, rows: withRunningBalance(income, outflow) }
}
