import { test as base, expect, type Page } from '@playwright/test'
import { seedData } from './fixtures'

export { expect }
export { iso } from './fixtures'
export const SHOTS = '/tmp/payhub-qa'

export type Lang = 'id' | 'en'
export type Theme = 'light' | 'dark'

export interface SeedOpts {
  lang?: Lang
  theme?: Theme
  data?: Record<string, unknown> | 'empty'
  auth?: Record<string, unknown> | null
  extra?: Record<string, unknown>
}

export const NAV: { key: string; id: string; en: string }[] = [
  { key: 'home', id: 'Beranda', en: 'Home' },
  { key: 'customers', id: 'Data Pelanggan', en: 'Customer Data' },
  { key: 'quotations', id: 'Penawaran', en: 'Quotations' },
  { key: 'invoices', id: 'Invoice', en: 'Invoices' },
  { key: 'orders', id: 'Pesanan', en: 'Orders' },
  { key: 'orderDetails', id: 'Detail Pesanan', en: 'Order Details' },
  { key: 'calendar', id: 'Kalender Acara', en: 'Event Calendar' },
  { key: 'expenses', id: 'Pengeluaran', en: 'Expenses' },
  { key: 'ledger', id: 'Pemasukan & Pengeluaran', en: 'Income & Expenses' },
  { key: 'margin', id: 'Margin Proyek', en: 'Project Margin' },
  { key: 'bestsellers', id: 'Paket Terlaris', en: 'Best-Selling Packages' },
  { key: 'masterDashboard', id: 'Dashboard Utama', en: 'Main Dashboard' },
]

/** Seed localStorage once per browser tab (guarded by sessionStorage so reloads keep app-written data). */
export async function seed(page: Page, o: SeedOpts = {}) {
  const payload: Record<string, unknown> = {
    payhub_lang: o.lang ?? 'id',
    payhub_theme: o.theme ?? 'light',
    ...(o.data === 'empty' ? { payhub_customers: [], payhub_quotations: [], payhub_invoices: [], payhub_expenses: [] } : (o.data ?? seedData)),
    ...(o.extra ?? {}),
  }
  if (o.auth !== null) payload.payhub_auth = o.auth ?? { email: 'qa@example.com', name: 'QA Tester', loggedAt: new Date().toISOString() }
  await page.addInitScript((p) => {
    if (sessionStorage.getItem('__seeded')) return
    sessionStorage.setItem('__seeded', '1')
    localStorage.clear()
    for (const [k, v] of Object.entries(p)) localStorage.setItem('payhub::' + k, typeof v === 'string' ? v : JSON.stringify(v))
  }, payload)
}

export const test = base.extend<{ errors: string[] }>({
  errors: [
    async ({ page }, use) => {
      const errors: string[] = []
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(`console.error: ${m.text()}`)
      })
      page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
      await use(errors)
      expect(errors, 'unexpected console/page errors').toEqual([])
    },
    { auto: true },
  ],
})

export async function ls(page: Page, key: string) {
  await page.waitForTimeout(700) // collections persist with a 500ms debounce
  return page.evaluate((k) => {
    const raw = localStorage.getItem('payhub::' + k)
    return raw === null ? null : JSON.parse(raw)
  }, key)
}

export async function goto(page: Page, o: SeedOpts = {}) {
  await seed(page, o)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
}

export function isMobile(page: Page) {
  return (page.viewportSize()?.width ?? 1440) < 768
}

export async function openNav(page: Page, label: string) {
  if (isMobile(page)) {
    await page.getByRole('button', { name: /toggle sidebar/i }).click()
    const sheet = page.getByRole('dialog')
    await sheet.locator('[data-sidebar="menu-button"]').filter({ has: page.getByText(label, { exact: true }) }).click()
    await expect(sheet).toBeHidden()
  } else {
    await page.locator('[data-sidebar="menu-button"]').filter({ has: page.getByText(label, { exact: true }) }).click()
  }
  await page.waitForLoadState('networkidle')
}

export async function stubWindow(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __opened: string[]; __printed: number }
    w.__opened = []
    w.__printed = 0
    window.open = ((url?: string | URL) => {
      w.__opened.push(String(url))
      return null
    }) as typeof window.open
    window.print = () => {
      w.__printed++
    }
  })
}

export async function noHScroll(page: Page) {
  const r = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }))
  expect(r.sw, `horizontal page scroll (scrollWidth ${r.sw} > ${r.cw})`).toBeLessThanOrEqual(r.cw)
}
