import type { Customer, CustomerSnap } from '@/lib/types'

export const emptySnap = (): CustomerSnap => ({ name: '', address: '', phone: '', email: '' })

/** Snapshot customer yang disimpan di dokumen (bentuk sama dengan versi lama). */
export const snapFromCustomer = (c?: Customer): CustomerSnap =>
  c ? { name: c.name, address: c.city, phone: c.phone, email: c.email } : emptySnap()

export const blankDoc = () => ({ customerId: '', customerSnap: emptySnap(), items: [] })
