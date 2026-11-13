import { createContext, useContext } from 'react'
import type { TabKey } from './constants'
import type { Customer, Expense, Invoice, OverdueInvoice, Quotation } from './types'
import type { Dispatch, SetStateAction } from 'react'

export interface AppCtx {
  customers: Customer[]
  setCustomers: Dispatch<SetStateAction<Customer[]>>
  quotations: Quotation[]
  setQuotations: Dispatch<SetStateAction<Quotation[]>>
  invoices: Invoice[]
  setInvoices: Dispatch<SetStateAction<Invoice[]>>
  expenses: Expense[]
  setExpenses: Dispatch<SetStateAction<Expense[]>>
  overdueInvoices: OverdueInvoice[]
  tab: TabKey
  setTab: (t: TabKey) => void
  selectedInvoiceId: string | null
  setSelectedInvoiceId: (id: string | null) => void
  detailCustomerId: string | null
  setDetailCustomerId: (id: string | null) => void
  /** Buka tampilan cetak untuk dokumen tertentu */
  setPrintTarget: (t: { type: 'invoice' | 'quotation'; id: string; autoPrint?: boolean } | null) => void
  markBackupDone: () => void
}

export const AppContext = createContext<AppCtx | null>(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppContext.Provider>')
  return ctx
}
