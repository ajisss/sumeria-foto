/** Format tanggal lokal YYYY-MM-DD (hindari pergeseran zona waktu dari toISOString). */
export function localISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export type Period = 'day' | 'week' | 'month' | 'year' | 'custom'

export function periodRange(p: Period) {
  const now = new Date()
  const end = localISO(now)
  let start: string
  if (p === 'day') start = end
  else if (p === 'week') {
    const w = new Date(now)
    w.setDate(w.getDate() - 6)
    start = localISO(w)
  } else if (p === 'month') start = localISO(new Date(now.getFullYear(), now.getMonth(), 1))
  else start = localISO(new Date(now.getFullYear(), 0, 1))
  return { start, end }
}
