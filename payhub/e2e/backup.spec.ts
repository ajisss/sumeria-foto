import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { expect, goto, ls, test } from './helpers'
import type { Page } from '@playwright/test'

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'payhub-bk-'))
const write = (name: string, content: unknown) => {
  const p = path.join(tmp, name)
  fs.writeFileSync(p, typeof content === 'string' ? content : JSON.stringify(content))
  return p
}

async function openBackup(page: Page) {
  if ((page.viewportSize()?.width ?? 1440) < 768) await page.getByRole('button', { name: /toggle sidebar/i }).click()
  await page.getByRole('button', { name: 'Cadangan & Pemulihan' }).click()
  await expect(page.getByRole('dialog', { name: 'Cadangan Data' })).toBeVisible()
}

test.describe('backup', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page)
    await openBackup(page)
  })

  test('export full JSON, restore it after wiping, confirm dialog replaces data', async ({ page }) => {
    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Cadangkan semua data (.json)' }).click()])
    expect(dl.suggestedFilename()).toMatch(/^Sumeriapoto-Backup-Lengkap-\d{4}-\d{2}-\d{2}\.json$/)
    const file = path.join(tmp, 'full.json')
    await dl.saveAs(file)
    const json = JSON.parse(fs.readFileSync(file, 'utf8'))
    expect(json.customers).toHaveLength(4)
    expect(json.quotations).toHaveLength(3)
    expect(json.invoices).toHaveLength(4)
    expect(json.expenses).toHaveLength(4)
    expect(json.exportedAt).toBeTruthy()
    // backup timestamp recorded
    expect(await page.evaluate(() => localStorage.getItem('payhub::payhub_last_backup'))).toBeTruthy()

    // restore a smaller file first: data replaced
    const small = write('small.json', { customers: [{ id: 'x1', name: 'Only One' }], quotations: [], invoices: [], expenses: [] })
    await page.locator('input[type=file]').setInputFiles(small)
    const alert = page.getByRole('alertdialog')
    await expect(alert).toContainText('Timpa semua data?')
    await expect(alert).toContainText('1 pelanggan, 0 penawaran, 0 invoice, dan 0 pengeluaran')
    await alert.getByRole('button', { name: 'Batal' }).click()
    expect(await ls(page, 'payhub_customers')).toHaveLength(4)
    await page.locator('input[type=file]').setInputFiles(small)
    await page.getByRole('alertdialog').getByRole('button', { name: 'Ya, timpa data' }).click()
    await expect(page.getByRole('dialog')).toBeHidden()
    expect(await ls(page, 'payhub_customers')).toHaveLength(1)
    expect(await ls(page, 'payhub_invoices')).toHaveLength(0)

    // restore full export
    await openBackup(page)
    await page.locator('input[type=file]').setInputFiles(file)
    await page.getByRole('alertdialog').getByRole('button', { name: 'Ya, timpa data' }).click()
    expect(await ls(page, 'payhub_customers')).toHaveLength(4)
    expect(await ls(page, 'payhub_invoices')).toHaveLength(4)
    expect(await ls(page, 'payhub_expenses')).toHaveLength(4)
  })

  test('invalid file shows error toast and keeps data', async ({ page }) => {
    await page.locator('input[type=file]').setInputFiles(write('bad.json', '{not json'))
    await expect(page.getByText('File cadangan tidak valid atau rusak.')).toBeVisible()
    await page.locator('input[type=file]').setInputFiles(write('shape.json', { foo: 1 }))
    await expect(page.getByText(/File cadangan tidak valid: /)).toBeVisible()
    await expect(page.getByRole('alertdialog')).toHaveCount(0)
    expect(await ls(page, 'payhub_customers')).toHaveLength(4)
  })

  test('legacy-shaped backup (string numbers, missing keys) restores and renders', async ({ page }) => {
    const legacy = {
      customers: [{ id: 'lc1', name: 'Legacy Cust', gender: 'Male', phone: '0811', city: 'Solo' }],
      invoices: [
        {
          id: 'li1', invNumber: 'INV/001/2024', date: '2024-03-01', customerId: 'lc1', customerSnap: { name: 'Legacy Cust', phone: '0811' },
          items: [{ id: 'lit1', eventDate: '2024-04-01', packageItem: 'Wedding Gold Halfday', description: 'Photographer', qty: '2', unitPrice: '1500000', discount: '0' }],
          paymentPlan: '2x',
          payments: [{ id: 'lp1', label: 'Down Payment', percent: 30, amount: 900000, paid: true, paidDate: '2024-03-02' }, { id: 'lp2', label: 'Paid Full', percent: 70, amount: 2100000, paid: false, paidDate: null }],
        },
      ],
    }
    await page.locator('input[type=file]').setInputFiles(write('legacy.json', legacy))
    await expect(page.getByRole('alertdialog')).toContainText('1 pelanggan, 0 penawaran, 1 invoice, dan 0 pengeluaran')
    await page.getByRole('alertdialog').getByRole('button', { name: 'Ya, timpa data' }).click()
    await page.getByRole('button', { name: /toggle sidebar/i }).isVisible().then(async (v) => { if (v && (page.viewportSize()?.width ?? 1440) < 768) await page.getByRole('button', { name: /toggle sidebar/i }).click() })
    await page.locator('[data-sidebar="menu-button"]').filter({ hasText: /^Invoice$/ }).click()
    await expect(page.locator('tbody tr')).toHaveCount(1)
    await expect(page.locator('tbody tr')).toContainText('Rp 3.000.000')
    await expect(page.locator('tbody tr')).toContainText('Down Payment')
  })

  test('monthly XLSX export downloads', async ({ page }) => {
    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Ekspor bulan ini (.xlsx)' }).click()])
    expect(dl.suggestedFilename()).toMatch(/^Sumeriapoto-Backup-\d{4}-\d{2}\.xlsx$/)
    const p = await dl.path()
    expect(fs.statSync(p).size).toBeGreaterThan(1000)
    // month with data selectable
    await page.getByRole('combobox').click()
    expect(await page.getByRole('option').count()).toBeGreaterThan(1)
  })
})
