export type PlanKey = '2x' | '3x' | '4x' | '5x'
export type ExpenseCategory = 'Project' | 'Marketing' | 'Asset' | 'Salary' | 'Other'

export interface Customer {
  id: string
  name: string
  gender?: string
  email?: string
  phone?: string
  city?: string
  [key: string]: unknown
}

export interface CustomerSnap {
  name?: string
  phone?: string
  email?: string
  city?: string
  [key: string]: unknown
}

export interface DocItem {
  id: string
  eventDate?: string
  packageItem?: string
  description?: string
  qty: number | string
  unitPrice: number | string
  discount?: number | string
  [key: string]: unknown
}

export interface Quotation {
  id: string
  quoNumber?: string
  date?: string
  customerId?: string
  customerSnap?: CustomerSnap
  items: DocItem[]
  notes?: string
  lastUpdated?: string
  [key: string]: unknown
}

export interface Payment {
  id: string
  label: string
  percent: number
  amount: number
  paid: boolean
  paidDate: string | null
}

export interface Invoice {
  id: string
  invNumber?: string
  date?: string
  customerId?: string
  customerSnap?: CustomerSnap
  items: DocItem[]
  paymentPlan: PlanKey
  payments: Payment[]
  notes?: string
  lastUpdated?: string
  sourceQuotationId?: string
  [key: string]: unknown
}

export interface ExpenseRow {
  id: string
  [key: string]: unknown
}

export interface Expense {
  id: string
  date?: string
  category: ExpenseCategory
  invoiceId?: string
  [key: string]: unknown
}

export interface OverdueInvoice {
  id: string
  invNumber?: string
  customer?: string
  phone?: string
  eventDate: string
  deadline: string
  remaining: number
  daysOverdue: number
}
