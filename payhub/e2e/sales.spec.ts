import fs from 'node:fs'
import { expect, goto, iso, ls, openNav, stubWindow, test } from './helpers'
import type { Locator, Page } from '@playwright/test'
import { invoices as fxInv } from './fixtures'

async function pick(page: Page, trigger: Locator, option: string | RegExp) {
  await trigger.click()
  await page.getByRole('option', { name: option }).first().click()
}

const money = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

test.describe('quotations', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page)
    await openNav(page, 'Penawaran')
  })

  test('create with items editor math, edit, convert twice, delete', async ({ page }) => {
    await expect(page.locator('tbody tr')).toHaveCount(3)
    await page.getByRole('button', { name: 'Buat penawaran' }).click()
    const dlg = page.getByRole('dialog')
    await expect(dlg.locator('#quo-number')).toHaveValue(/^QUO\/004\/\d{4}$/)
    await expect(dlg.getByRole('button', { name: 'Simpan' })).toBeDisabled()
    await pick(page, dlg.locator('#quo-customer'), 'Dewi Lestari')
    await expect(dlg).toContainText('Yogyakarta')

    await dlg.getByRole('button', { name: 'Tambah item' }).click()
    await pick(page, dlg.getByRole('combobox', { name: 'Item paket' }), 'Wedding Diamond Fullday')
    // description multi-select
    await dlg.getByRole('button', { name: 'Deskripsi' }).last().click()
    await page.getByRole('option', { name: 'Photographer', exact: true }).click()
    await page.getByRole('option', { name: 'Drone' }).click()
    await page.getByRole('checkbox', { name: 'Lainnya (isi sendiri)' }).click()
    await page.getByPlaceholder('Tulis deskripsi lainnya').fill('Cetak foto')
    await page.keyboard.press('Escape')
    await expect(dlg.getByRole('button', { name: 'Deskripsi' }).last()).toContainText('Drone')
    await expect(dlg.getByRole('button', { name: 'Deskripsi' }).last()).toContainText('Cetak foto')
    await dlg.getByLabel('Qty').fill('2')
    await dlg.getByLabel('Harga satuan').fill('1500000')
    await dlg.getByLabel('Diskon').fill('500000')
    await expect(dlg.getByLabel('Harga satuan')).toHaveValue('1.500.000')
    // 2*1.5M - 0.5M = 2.5M ; DP 30% = 750k
    await expect(dlg.getByText(money(2500000))).toHaveCount(2) // row subtotal + total
    await expect(dlg.getByText(money(750000))).toBeVisible()

    // custom 'Lainnya' package
    await dlg.getByRole('button', { name: 'Tambah item' }).click()
    await pick(page, dlg.getByRole('combobox', { name: 'Item paket' }).nth(1), 'Lainnya (isi sendiri)')
    await dlg.getByPlaceholder('Tulis item paket').fill('Paket Spesial')
    await dlg.getByLabel('Qty').nth(1).fill('1')
    await dlg.getByLabel('Harga satuan').nth(1).fill('1000000')
    await expect(dlg.getByText(money(3500000))).toBeVisible()

    await dlg.getByRole('button', { name: 'Simpan' }).click()
    await expect(page.getByText('Penawaran dibuat', { exact: true })).toBeVisible()
    const quos = (await ls(page, 'payhub_quotations')) as { quoNumber: string; customerId: string; items: { packageItem: string; description: string; qty: number; unitPrice: number; discount: number }[] }[]
    const created = quos.find((q) => q.customerId === 'c4')!
    expect(created.items).toHaveLength(2)
    expect(created.items[0]).toMatchObject({ packageItem: 'Wedding Diamond Fullday', description: 'Photographer, Drone, Cetak foto', unitPrice: 1500000, discount: 500000 })
    expect(Number(created.items[0].qty)).toBe(2)
    expect(created.items[1].packageItem).toBe('Paket Spesial')

    // edit
    const row = page.locator('tbody tr', { hasText: created.quoNumber })
    await row.getByRole('button', { name: 'Ubah', exact: true }).click()
    await expect(page.getByRole('dialog').getByRole('heading', { name: 'Ubah penawaran' })).toBeVisible()
    await page.getByRole('dialog').getByLabel('Qty').first().fill('3')
    await page.getByRole('dialog').getByRole('button', { name: 'Simpan' }).click()
    await expect(page.getByText('Penawaran diperbarui', { exact: true })).toBeVisible()
    await expect(row).toContainText(money(3 * 1500000 - 500000 + 1000000))

    // delete: cancel then confirm
    await row.getByRole('button', { name: 'Hapus' }).click()
    await page.getByRole('alertdialog').getByRole('button', { name: 'Batal' }).click()
    await expect(row).toBeVisible()
    await row.getByRole('button', { name: 'Hapus' }).click()
    await page.getByRole('alertdialog').getByRole('button', { name: 'Hapus', exact: true }).click()
    await expect(page.getByText('Penawaran dihapus', { exact: true })).toBeVisible()
    await expect(row).toHaveCount(0)
  })

  test('convert to invoice (30/70, sourceQuotationId); converting twice asks confirmation', async ({ page }) => {
    const row = page.locator('tbody tr', { hasText: 'QUO/002' })
    await row.getByRole('button', { name: 'Ubah jadi invoice' }).click()
    await expect(page.getByText('Penawaran berhasil diubah jadi invoice').first()).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Invoice', exact: true }).first()).toBeVisible()
    const invs = (await ls(page, 'payhub_invoices')) as { invNumber: string; sourceQuotationId?: string; payments: { percent: number; amount: number; paid: boolean }[]; items: { id: string }[]; paymentPlan: string }[]
    expect(invs).toHaveLength(5)
    const inv = invs.find((i) => i.sourceQuotationId === 'q2')!
    expect(inv.paymentPlan).toBe('2x')
    expect(inv.payments.map((p) => p.percent)).toEqual([30, 70])
    expect(inv.payments.map((p) => p.amount)).toEqual([900000, 2100000])
    expect(inv.payments.every((p) => !p.paid)).toBe(true)
    expect(inv.invNumber).toMatch(/^INV\/005\//)
    expect(inv.items[0].id).not.toBe('qi3')

    // q1 already has invoice i1 -> confirmation
    await openNav(page, 'Penawaran')
    const row1 = page.locator('tbody tr', { hasText: 'QUO/001' })
    await row1.getByRole('button', { name: 'Ubah jadi invoice' }).click()
    const alert = page.getByRole('alertdialog')
    await expect(alert).toContainText('QUO/001')
    await expect(alert).toContainText('INV/001')
    await alert.getByRole('button', { name: 'Batal' }).click()
    expect(await ls(page, 'payhub_invoices')).toHaveLength(5)
    await row1.getByRole('button', { name: 'Ubah jadi invoice' }).click()
    await page.getByRole('alertdialog').getByRole('button', { name: 'Buat invoice baru' }).click()
    await expect(page.getByText('Penawaran berhasil diubah jadi invoice').first()).toBeVisible()
    const after = (await ls(page, 'payhub_invoices')) as { sourceQuotationId?: string; payments: { amount: number }[] }[]
    expect(after).toHaveLength(6)
    expect(after.filter((i) => i.sourceQuotationId === 'q1')).toHaveLength(2)
    expect(after[5].payments.map((p) => p.amount)).toEqual([1800000, 4200000])
  })

  test('print menu: PrintView opens (print stubbed), WhatsApp url ID copy, PDF small', async ({ page }) => {
    await stubWindow(page)
    await page.reload()
    await page.waitForLoadState('networkidle')
    await openNav(page, 'Penawaran')
    const row = page.locator('tbody tr', { hasText: 'QUO/001' })
    await row.getByRole('button', { name: 'Cetak / kirim' }).click()
    await page.getByRole('menuitem', { name: 'Kirim via WhatsApp' }).click()
    await expect.poll(() => page.evaluate(() => (window as unknown as { __opened: string[] }).__opened.length)).toBe(1)
    const url = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened[0])
    expect(url).toMatch(/^https:\/\/wa\.me\/6281234567890\?text=/)
    const text = decodeURIComponent(url.split('text=')[1])
    expect(text).toContain('Rincian Item')
    expect(text).toContain(money(6000000))
    expect(text).toContain(money(1800000))
    expect(text).toContain('Sisa Pembayaran (70%): ' + money(4200000))

    await row.getByRole('button', { name: 'Cetak / kirim' }).click()
    await page.getByRole('menuitem', { name: 'Ekspor PDF' }).click()
    await expect(page.getByRole('button', { name: 'Kembali' })).toBeVisible()
    await expect(page.getByRole('article')).toContainText('QUO/001')
    await expect.poll(() => page.evaluate(() => (window as unknown as { __printed: number }).__printed)).toBeGreaterThan(0)
    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Ekspor PDF' }).click()])
    const path = await dl.path()
    expect(dl.suggestedFilename()).toMatch(/\.pdf$/)
    expect(fs.statSync(path).size).toBeGreaterThan(2000)
    expect(fs.statSync(path).size).toBeLessThan(600_000)
    await page.getByRole('button', { name: 'Kembali' }).click()
    await expect(page.getByRole('heading', { name: 'Penawaran' }).first()).toBeVisible()
  })
})

test.describe('invoices', () => {
  test.beforeEach(async ({ page }) => {
    await stubWindow(page)
    await goto(page)
    await openNav(page, 'Invoice')
  })

  test('list shows statuses; edit changes payment plan 2x-5x keeping sum; mark paid', async ({ page }) => {
    const rows = page.locator('tbody tr')
    await expect(rows).toHaveCount(4)
    await expect(rows.filter({ hasText: 'INV/003' })).toContainText('Pelunasan')
    await expect(rows.filter({ hasText: 'INV/001' })).toContainText('Belum dibayar')

    const row = rows.filter({ hasText: 'INV/001' })
    await row.getByRole('button', { name: 'Ubah', exact: true }).click()
    const dlg = page.getByRole('dialog')
    await expect(dlg.getByRole('heading', { name: 'Ubah invoice' })).toBeVisible()
    for (const n of [2, 3, 4, 5]) {
      await pick(page, dlg.locator('#inv-plan'), `Bayar ${n}x`)
      const amounts = await dlg.locator('table').last().locator('tbody tr td:nth-child(3)').allInnerTexts()
      expect(amounts).toHaveLength(n)
      const sum = amounts.reduce((s, a) => s + Number(a.replace(/[^0-9]/g, '')), 0)
      expect(sum, `plan ${n}x sums to subtotal`).toBe(10000000)
    }
    await pick(page, dlg.locator('#inv-plan'), 'Bayar 3x')
    await dlg.getByRole('button', { name: /Ubah status pembayaran Uang Muka/ }).first().click()
    await expect(dlg.locator('tbody tr').last()).toBeVisible()
    await dlg.getByRole('button', { name: 'Simpan' }).click()
    await expect(page.getByText('Invoice disimpan', { exact: true })).toBeVisible()
    const inv = ((await ls(page, 'payhub_invoices')) as { id: string; paymentPlan: string; payments: { amount: number; paid: boolean; paidDate: string | null }[] }[]).find((i) => i.id === 'i1')!
    expect(inv.paymentPlan).toBe('3x')
    expect(inv.payments).toHaveLength(3)
    expect(inv.payments.reduce((s, p) => s + p.amount, 0)).toBe(10000000)
    expect(inv.payments[0].paid).toBe(true)
    expect(inv.payments[0].paidDate).toBe(new Date().toISOString().slice(0, 10))
    expect(inv.payments[1].paid).toBe(false)
    await expect(page.locator('tbody tr').filter({ hasText: 'INV/001' })).not.toContainText('Belum dibayar')
  })

  test('create invoice, fill from quotation, then delete', async ({ page }) => {
    await page.getByRole('button', { name: 'Buat invoice' }).click()
    const dlg = page.getByRole('dialog')
    await expect(dlg.locator('#inv-number')).toHaveValue(/INV\/005/)
    await pick(page, dlg.locator('#inv-customer'), 'Budi Santoso')
    await dlg.getByRole('button', { name: 'Isi dari penawaran' }).click()
    await expect(dlg.getByText(money(6000000)).first()).toBeVisible()
    await dlg.getByRole('button', { name: 'Simpan' }).click()
    await expect(page.getByText('Invoice dibuat', { exact: true })).toBeVisible()
    const row = page.locator('tbody tr', { hasText: 'INV/005' })
    await expect(row).toContainText(money(6000000))
    await row.getByRole('button', { name: 'Hapus' }).click()
    await page.getByRole('alertdialog').getByRole('button', { name: 'Hapus', exact: true }).click()
    await expect(page.getByText('Invoice dihapus', { exact: true })).toBeVisible()
    await expect(page.locator('tbody tr')).toHaveCount(4)
  })

  test('print menu: PDF/print view, WhatsApp opens wa.me (ID)', async ({ page }) => {
    const row = page.locator('tbody tr', { hasText: 'INV/002' })
    await row.getByRole('button', { name: 'Cetak / kirim' }).click()
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('menuitem', { name: 'Kirim via WhatsApp' }).click(),
    ])
    expect(dl.suggestedFilename()).toMatch(/\.pdf$/)
    const url = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened[0])
    expect(url).toMatch(/^https:\/\/wa\.me\/6281299990000\?text=/)
    const text = decodeURIComponent(url.split('text=')[1])
    expect(text).toContain('#INV/002')
    expect(text).toContain('Halo Kak Siti Rahayu')

    await row.getByRole('button', { name: 'Cetak / kirim' }).click()
    await page.getByRole('menuitem', { name: 'Ekspor PDF' }).click()
    await expect(page.getByRole('article')).toContainText('INV/002')
    await expect(page.getByRole('article')).toContainText('Siti Rahayu')
    await page.getByRole('button', { name: 'Kembali' }).click()
  })

  test('english whatsapp copy', async ({ page }) => {
    await page.getByRole('button', { name: 'Bahasa' }).click()
    await openNav(page, 'Invoices')
    const row = page.locator('tbody tr', { hasText: 'INV/002' })
    await row.getByRole('button', { name: 'Print / send' }).click()
    await Promise.all([page.waitForEvent('download'), page.getByRole('menuitem', { name: /WhatsApp/ }).click()])
    const url = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened[0])
    const text = decodeURIComponent(url.split('text=')[1])
    expect(text).toContain('Hi')
    expect(text).not.toContain('Halo Kak')
  })
})

test('fixture sanity', () => {
  expect(fxInv).toHaveLength(4)
  expect(iso(0)).toMatch(/^\d{4}-\d{2}-\d{2}$/)
})
