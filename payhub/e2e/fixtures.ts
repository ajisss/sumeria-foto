/** Deterministic fixture data. Dates are relative to "today" so overdue logic is stable. */
const DAY = 864e5
export const iso = (offset: number) => new Date(Date.now() + offset * DAY).toISOString().slice(0, 10)
const year = new Date().getFullYear()

export const customers = [
  { id: 'c1', name: 'Budi Santoso', gender: 'Male', email: 'budi@example.com', phone: '081234567890', city: 'Jakarta' },
  { id: 'c2', name: 'Siti Rahayu', gender: 'Female', email: 'siti@example.com', phone: '+62 812-9999-0000', city: 'Bandung' },
  { id: 'c3', name: 'Andi Wijaya', gender: 'Male', email: '', phone: '085611112222', city: 'Surabaya' },
  { id: 'c4', name: 'Dewi Lestari', gender: 'Female', email: 'dewi@example.com', phone: '087700001111', city: 'Yogyakarta' },
]

const item = (id: string, eventDate: string, pkg: string, desc: string, qty: number, unitPrice: number, discount = 0) => ({
  id, eventDate, packageItem: pkg, description: desc, qty, unitPrice, discount,
})

const snap = (c: (typeof customers)[number]) => ({ name: c.name, phone: c.phone, email: c.email, city: c.city })
const pay = (id: string, label: string, percent: number, amount: number, paid: boolean, paidDate: string | null) => ({ id, label, percent, amount, paid, paidDate })

export const quotations = [
  { id: 'q1', quoNumber: `QUO/001/${year}`, date: iso(-20), customerId: 'c1', customerSnap: snap(customers[0]), notes: 'Catatan penawaran 1',
    items: [item('qi1', iso(30), 'Wedding Gold Halfday', 'Photographer, Videographer', 1, 5000000, 500000), item('qi2', iso(30), 'Additional', 'Drone', 2, 750000)] },
  { id: 'q2', quoNumber: `QUO/002/${year}`, date: iso(-10), customerId: 'c2', customerSnap: snap(customers[1]),
    items: [item('qi3', iso(45), 'Couple Session Gold', 'Photographer', 1, 3000000)] },
  { id: 'q3', quoNumber: `QUO/003/${year}`, date: iso(-2), customerId: 'c3', customerSnap: snap(customers[2]),
    items: [item('qi4', iso(60), 'Lainnya - (isi sendiri)', 'Custom shoot', 3, 1000000, 100000)] },
]

export const invoices = [
  // unpaid, event far away
  { id: 'i1', invNumber: `INV/001/${year}`, date: iso(-15), customerId: 'c1', customerSnap: snap(customers[0]), paymentPlan: '2x', sourceQuotationId: 'q1',
    items: [item('ii1', iso(25), 'Wedding Gold Halfday', 'Photographer', 1, 10000000)],
    payments: [pay('p1', 'Down Payment', 30, 3000000, false, null), pay('p2', 'Paid Full', 70, 7000000, false, null)] },
  // DP paid
  { id: 'i2', invNumber: `INV/002/${year}`, date: iso(-12), customerId: 'c2', customerSnap: snap(customers[1]), paymentPlan: '3x',
    items: [item('ii2', iso(25), 'Couple Session Gold', 'Photographer', 2, 2000000, 1000000)],
    payments: [pay('p3', 'Down Payment', 30, 900000, true, iso(-10)), pay('p4', 'Second Payment', 35, 1050000, false, null), pay('p5', 'Paid Full', 35, 1050000, false, null)] },
  // fully paid
  { id: 'i3', invNumber: `INV/003/${year}`, date: iso(-40), customerId: 'c3', customerSnap: snap(customers[2]), paymentPlan: '2x',
    items: [item('ii3', iso(-5), 'Candid Wedding Fullday', 'Photographer, Videographer', 1, 8000000)],
    payments: [pay('p6', 'Down Payment', 30, 2400000, true, iso(-38)), pay('p7', 'Paid Full', 70, 5600000, true, iso(-6))] },
  // overdue (event in 3 days, unpaid DP only)
  { id: 'i4', invNumber: `INV/004/${year}`, date: iso(-8), customerId: 'c4', customerSnap: snap(customers[3]), paymentPlan: '2x',
    items: [item('ii4', iso(3), 'Special Event Gold', 'Photographer', 1, 4000000), item('ii5', iso(3), 'Additional', 'Extra hour', 1, 500000)],
    payments: [pay('p8', 'Down Payment', 30, 1350000, true, iso(-7)), pay('p9', 'Paid Full', 70, 3150000, false, null)] },
]

export const expenses = [
  { id: 'e1', date: iso(-9), category: 'Project', invoiceId: 'i2', itemName: 'Photographer Half Day', qty: 1, unitPrice: 600000 },
  { id: 'e2', date: iso(-4), category: 'Project', invoiceId: 'i3', itemName: 'Drone', qty: 2, unitPrice: 250000 },
  { id: 'e3', date: iso(-3), category: 'Marketing', itemName: 'Meta Ads', qty: 1, unitPrice: 400000 },
  { id: 'e4', date: iso(-1), category: 'Other', itemName: 'Parkir & bensin', qty: 3, unitPrice: 50000 },
]

export const seedData = { payhub_customers: customers, payhub_quotations: quotations, payhub_invoices: invoices, payhub_expenses: expenses }
