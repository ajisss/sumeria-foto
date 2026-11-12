/**
 * Adapter penyimpanan. Sekarang localStorage (key prefix `payhub::` sama dengan versi lama
 * supaya data lama tetap terbaca). Nanti ditukar ke backend (Supabase) cukup di sini.
 */
const PREFIX = 'payhub::'

export const storage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(PREFIX + key)
    } catch {
      return null
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(PREFIX + key, value)
    } catch {
      /* quota / private mode */
    }
  },
  remove(key: string) {
    try {
      localStorage.removeItem(PREFIX + key)
    } catch {
      /* noop */
    }
  },
  getJSON<T>(key: string, fallback: T): T {
    const raw = this.get(key)
    if (raw === null) return fallback
    try {
      return JSON.parse(raw) as T
    } catch {
      return fallback
    }
  },
  setJSON(key: string, value: unknown) {
    this.set(key, JSON.stringify(value))
  },
}
