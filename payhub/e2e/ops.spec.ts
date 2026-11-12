import { expect, goto, iso, ls, openNav, stubWindow, test } from './helpers'
import type { Locator, Page } from '@playwright/test'

async function pick(page: Page, trigger: Locator, option: string | RegExp) {
  await trigger.click()
  await page.getByRole('option', { name: option }).first().click()
}
const money = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
const stat = (page: Page, label: string | RegExp) => page.locator('[data-slot=card]', { hasText: label }).filter({ hasText: /Rp/ }).first()

test.describe('overview pages', () => {
  test.beforeEach(async ({ page }) => {
    await stubWindow(page)
    await goto(page)
  })

  test('home tiles navigate', async ({ page }) => {
    await expect(page.getByText('PayHub').first()).toBeVisible()
    await page.getByRole('main').getByRole('button', { name: 'Kalender Acara' }).click()
    await expect(page.getByRole('heading', { name: /Kalender/ }).first()).toBeVisible()
  })

  test('orders: search, note save, open details', async ({ page }) => {
    await openNav(page, 'Pesanan')
    await expect(page.locator('tbody tr')).toHaveCount(4)
    await page.getByPlaceholder('Cari…').fill('Dewi')
    await expect(page.locator('tbody tr')).toHaveCount(1)
    await expect(page.locator('tbody tr')).toContainText('Belum lunas')
    await page.getByLabel('Catatan untuk INV/004').fill('Bawa lampu tambahan')
    await page.getByLabel('Catatan untuk INV/004').blur()
    const invs = (await ls(page, 'payhub_invoices')) as { id: string; notes?: string }[]
    expect(invs.find((i) => i.id === 'i4')?.notes).toBe('Bawa lampu tambahan')
    await page.locator('tbody tr').first().locator('td').first().click()
    await expect(page.getByRole('heading', { name: 'Detail Pesanan' })).toBeVisible()
    await expect(page.getByRole('main')).toContainText('INV/004')
    await expect(page.getByText('Bawa lampu tambahan')).toBeVisible()
  })

  test('order details: numbers, progress, print/pdf/wa', async ({ page }) => {
    await openNav(page, 'Detail Pesanan')
    await pick(page, page.locator('#od-pick'), /INV\/002/)
    const main = page.getByRole('main')
    await expect(main).toContainText(money(3000000))
    await expect(main).toContainText(money(900000))
    await expect(main).toContainText(money(2100000))
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '30')
    await expect(main).toContainText('Dibayar')
    await page.getByRole('button', { name: 'Kirim via WhatsApp' }).click()
    const url = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened.at(-1))
    expect(url).toContain('wa.me/6281299990000')
    await page.getByRole('button', { name: 'Cetak', exact: true }).click()
    await expect(page.getByRole('article')).toContainText('INV/002')
  })

  test('calendar: clash warning and day events', async ({ page }) => {
    await openNav(page, 'Kalender Acara')
    const clashDay = page.getByRole('button', { name: /: 2 acara$/ })
    for (let i = 0; i < 3 && !(await clashDay.count()); i++) await page.getByRole('button', { name: 'Bulan berikutnya' }).click()
    await expect(clashDay).toHaveCount(1)
    await clashDay.click()
    await expect(page.getByRole('alert').filter({ hasText: 'Ada 2 acara di tanggal yang sama' })).toBeVisible()
    await expect(page.getByRole('main')).toContainText('Budi Santoso')
    await expect(page.getByRole('main')).toContainText('Siti Rahayu')
    // single-event day has no clash alert
    await page.getByRole('button', { name: 'Bulan sebelumnya' }).click()
    await page.getByRole('button', { name: 'Bulan berikutnya' }).click()
    const single = page.getByRole('button', { name: /: 1 acara$/ }).first()
    if (await single.count()) {
      await single.click()
      await expect(page.getByRole('alert').filter({ hasText: 'Ada' })).toHaveCount(0)
    }
    await page.getByRole('button', { name: /Buka detail pesanan|INV\/00/ }).first().click().catch(() => undefined)
  })

  test('bestsellers: aggregates', async ({ page }) => {
    await openNav(page, 'Paket Terlaris')
    const rows = page.locator('tbody tr')
    await expect(rows).toHaveCount(5) // Wedding Gold Halfday, Couple Gold, Candid Fullday, Special Event Gold, Additional
    const first = rows.first()
    await expect(first).toContainText('Wedding Gold Halfday')
    await expect(first).toContainText(money(10000000))
  })

  test('dashboard: overdue reminder, period filters, numbers', async ({ page }) => {
    await openNav(page, 'Dashboard Utama')
    await expect(page.getByText('Invoice terlambat dilunasi: 1')).toBeVisible()
    await expect(page.getByText('INV/004 — Dewi Lestari')).toBeVisible()
    await expect(page.getByText(money(3150000) + ' · 4 hari terlambat')).toBeVisible()
    await page.getByRole('button', { name: 'Kirim pengingat WhatsApp untuk INV/004' }).click()
    const url = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened.at(-1))
    expect(url).toMatch(/^https:\/\/wa\.me\/6287700001111\?text=/)
    const text = decodeURIComponent(url!.split('text=')[1])
    expect(text).toContain('Halo Kak Dewi Lestari')
    expect(text).toContain(money(3150000))
    // sidebar badge
    // custom range covers all fixtures
    await page.locator('#dash-from').fill(iso(-100))
    await page.locator('#dash-to').fill(iso(100))
    await expect(page.getByRole('tab', { name: 'Kustom' })).toHaveAttribute('aria-selected', 'true')
    await expect(stat(page, /^Pendapatan/i)).toContainText(money(10250000))
    await expect(stat(page, /^Pengeluaran/i)).toContainText(money(1650000))
    await expect(stat(page, /^Laba/i)).toContainText(money(8600000))
    for (const p of ['Hari', 'Minggu', 'Bulan', 'Tahun']) {
      await page.getByRole('tab', { name: p, exact: true }).click()
      await expect(page.getByRole('tab', { name: p, exact: true })).toHaveAttribute('aria-selected', 'true')
    }
    await page.getByRole('tab', { name: 'Hari', exact: true }).click()
    await expect(stat(page, /^Pendapatan/i)).toContainText('Rp 0')
    await page.locator('#dash-from').fill(iso(-100))
    await page.locator('#dash-to').fill(iso(100))
    // chart renders bars
    await expect(page.locator('.recharts-bar-rectangle').first()).toBeVisible()
    await page.getByRole('tab', { name: 'Tahunan' }).click()
    await expect(page.locator('.recharts-bar-rectangle').first()).toBeVisible()
    // open overdue -> details
    await page.getByRole('button', { name: 'Buka detail pesanan INV/004' }).click()
    await expect(page.getByRole('heading', { name: 'Detail Pesanan' })).toBeVisible()
    await expect(page.locator('#od-pick')).toContainText('INV/004')
  })

  test('expenses: multi-row add with linked invoice, filter, delete', async ({ page }) => {
    await openNav(page, 'Pengeluaran')
    await expect(page.locator('tbody tr').filter({ hasText: 'Photographer Half Day' })).toHaveCount(1)
    const save = page.getByRole('button', { name: 'Simpan semua item' })
    await expect(save).toBeDisabled()
    await pick(page, page.locator('#exp-invoice'), /INV\/004/)
    await expect(save).toBeEnabled()
    await page.getByLabel('Qty pada baris 1').fill('2')
    await page.getByLabel('Harga pada baris 1').fill('300000')
    await page.getByRole('button', { name: 'Tambah baris item' }).click()
    await pick(page, page.getByRole('combobox', { name: 'Item pada baris 2' }), 'Drone')
    await page.getByLabel('Qty pada baris 2').fill('3')
    await page.getByLabel('Harga pada baris 2').fill('100000')
    await expect(page.getByText(money(900000)).first()).toBeVisible()
    await save.click()
    await expect(page.getByText('Pengeluaran tersimpan')).toBeVisible()
    const exps = (await ls(page, 'payhub_expenses')) as { invoiceId: string; itemName: string; qty: number; unitPrice: number; category: string }[]
    expect(exps).toHaveLength(6)
    expect(exps.filter((e) => e.invoiceId === 'i4')).toHaveLength(2)
    expect(exps.find((e) => e.invoiceId === 'i4' && e.itemName === 'Drone')).toMatchObject({ qty: 3, unitPrice: 100000, category: 'Project' })
    const row = page.locator('tbody tr', { hasText: 'INV/004' }).first()
    await expect(row).toBeVisible()
    // delete
    await page.getByRole('button', { name: 'Hapus pengeluaran Drone' }).first().click()
    await page.getByRole('alertdialog').getByRole('button', { name: 'Hapus', exact: true }).click()
    await expect(page.getByText('Pengeluaran dihapus')).toBeVisible()
    expect(await ls(page, 'payhub_expenses')).toHaveLength(5)
    // other category
    await page.getByRole('tab', { name: 'Pemasaran' }).click()
    await expect(page.locator('tbody tr')).toHaveCount(1)
    await page.getByRole('tab', { name: 'Lainnya' }).click()
    await expect(page.locator('tbody tr').first()).toContainText('Parkir')
  })

  test('ledger: running balance math and type filter', async ({ page }) => {
    await openNav(page, 'Pemasukan & Pengeluaran')
    await expect(stat(page, 'Total pemasukan')).toContainText(money(10250000))
    await expect(stat(page, 'Total pengeluaran')).toContainText(money(1650000))
    await expect(stat(page, 'Saldo')).toContainText(money(8600000))
    const rows = page.locator('tbody tr')
    await expect(rows).toHaveCount(8) // 4 income + 4 expenses
    // chronological running balance: last row (asc) balance equals total balance
    await expect(rows.last().locator('td').nth(7)).toHaveText(money(8600000))
    await pick(page, page.getByRole('combobox', { name: 'Filter tipe' }).or(page.getByRole('combobox').first()), 'Pemasukan')
    await expect(rows).toHaveCount(4)
    // unpay an income entry
    await rows.first().getByRole('button').click()
    await expect(page.getByRole('alertdialog')).toBeVisible()
    await page.getByRole('alertdialog').getByRole('button', { name: 'Batal' }).click()
  })

  test('margin: per-invoice numbers', async ({ page }) => {
    await openNav(page, 'Margin Proyek')
    await expect(stat(page, 'Total pendapatan')).toContainText(money(10250000))
    await expect(stat(page, 'Total pengeluaran')).toContainText(money(1100000))
    await expect(stat(page, 'Total laba')).toContainText(money(9150000))
    const r2 = page.locator('tbody tr', { hasText: 'INV/002' })
    await expect(r2).toContainText(money(900000))
    await expect(r2).toContainText(money(600000))
    await expect(r2).toContainText(money(300000))
    await expect(r2).toContainText('33%')
    const r3 = page.locator('tbody tr', { hasText: 'INV/003' })
    await expect(r3).toContainText('94%')
  })
})
