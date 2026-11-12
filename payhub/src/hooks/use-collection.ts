import { useCallback, useEffect, useRef, useState } from 'react'
import { storage } from '@/lib/storage'
import { CustomerSchema, ExpenseSchema, InvoiceSchema, QuotationSchema, countInvalid } from '@/lib/schemas'

const SCHEMAS = {
  payhub_customers: CustomerSchema,
  payhub_quotations: QuotationSchema,
  payhub_invoices: InvoiceSchema,
  payhub_expenses: ExpenseSchema,
} as const

/** Validasi ringan saat load: record invalid TIDAK dibuang, hanya dicatat sekali. */
const warned = new Set<string>()
function warnInvalid(name: string, items: unknown) {
  if (warned.has(name)) return
  warned.add(name)
  const schema = SCHEMAS[name as keyof typeof SCHEMAS]
  if (!schema || !Array.isArray(items)) return
  const n = countInvalid(items, schema)
  if (n > 0) console.warn(`[payhub] ${n} record in "${name}" failed validation; kept unchanged.`)
}

/**
 * State koleksi yang dipersist ke storage (debounce 500ms), kompatibel dengan format lama:
 * key `payhub::<name>` berisi JSON array.
 */
export function useCollection<T>(name: string, initial: T[] = []) {
  const [items, setItems] = useState<T[]>(() => {
    const loaded = storage.getJSON<T[]>(name, initial)
    warnInvalid(name, loaded)
    return loaded
  })
  const first = useRef(true)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => storage.setJSON(name, items), 500)
    return () => clearTimeout(timer.current)
  }, [items, name])

  // flush saat tab ditutup
  useEffect(() => {
    const flush = () => storage.setJSON(name, items)
    window.addEventListener('beforeunload', flush)
    return () => window.removeEventListener('beforeunload', flush)
  }, [items, name])

  const replace = useCallback((next: T[]) => setItems(next), [])
  return [items, setItems, replace] as const
}
