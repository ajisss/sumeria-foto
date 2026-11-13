import { expect, goto, ls, openNav, test } from './helpers'

test.describe('customers', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page)
    await openNav(page, 'Data Pelanggan')
  })

  test('add, edit, search, sort, detail, delete (confirm), export xls', async ({ page }) => {
    await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(4)

    // add (phone input strips non-digits)
    await page.getByRole('button', { name: 'Tambah pelanggan' }).click()
    const dlg = page.getByRole('dialog')
    await dlg.locator('#cust-name').fill('Rina Kusuma')
    await dlg.locator('#cust-phone').fill('0812abc-34')
    await expect(dlg.locator('#cust-phone')).toHaveValue('081234')
    await dlg.locator('#cust-city').fill('Medan')
    await dlg.getByRole('button', { name: 'Simpan' }).click()
    await expect(page.getByText('Pelanggan ditambahkan')).toBeVisible()
    await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(5)
    const saved = (await ls(page, 'payhub_customers')) as { id: string; name: string; phone: string }[]
    expect(saved).toHaveLength(5)
    expect(saved.find((c) => c.name === 'Rina Kusuma')?.phone).toBe('081234')

    // edit
    await page.getByRole('button', { name: 'Ubah Rina Kusuma' }).click()
    await page.getByRole('dialog').locator('#cust-name').fill('Rina K. Putri')
    await page.getByRole('dialog').getByRole('button', { name: 'Simpan' }).click()
    await expect(page.getByText('Pelanggan diperbarui')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Lihat detail Rina K. Putri' })).toBeVisible()

    // search
    const search = page.getByPlaceholder(/Cari nama/)
    await search.fill('bandung')
    await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(1)
    await expect(page.getByText('Siti Rahayu')).toBeVisible()
    await search.fill('zzzzzz')
    await expect(page.getByText('Tidak ada pelanggan yang cocok dengan pencarian.')).toBeVisible()
    await search.fill('')

    // sort by name desc (default asc)
    const firstName = () => page.locator('tbody tr').first().locator('td').first().innerText()
    expect((await firstName()).trim()).toBe('Andi Wijaya')
    await page.getByRole('columnheader', { name: 'Nama' }).getByRole('button').click()
    await expect.poll(async () => (await firstName()).trim()).toBe('Siti Rahayu')

    // detail dialog + Esc
    await page.getByRole('button', { name: 'Lihat detail Budi Santoso' }).click()
    const detail = page.getByRole('dialog')
    await expect(detail).toContainText('Budi Santoso')
    await expect(detail).toContainText('INV/001')
    await page.keyboard.press('Escape')
    await expect(detail).toBeHidden()

    // delete: cancel then confirm
    await page.getByRole('button', { name: 'Hapus Rina K. Putri' }).click()
    const alert = page.getByRole('alertdialog')
    await expect(alert).toContainText('Rina K. Putri')
    await alert.getByRole('button', { name: 'Batal' }).click()
    await expect(alert).toBeHidden()
    await expect(page.getByRole('button', { name: 'Lihat detail Rina K. Putri' })).toBeVisible()
    await page.getByRole('button', { name: 'Hapus Rina K. Putri' }).click()
    await page.getByRole('alertdialog').getByRole('button', { name: 'Hapus', exact: true }).click()
    await expect(page.getByText('Pelanggan dihapus')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Lihat detail Rina K. Putri' })).toHaveCount(0)
    expect(await ls(page, 'payhub_customers')).toHaveLength(4)

    // export xls
    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Ekspor ke XLS' }).click()])
    expect(dl.suggestedFilename()).toMatch(/^Sumeriapoto_Customers_\d{4}-\d{2}-\d{2}\.xlsx$/)
  })

  test('empty customer name cannot be saved', async ({ page }) => {
    await page.getByRole('button', { name: 'Tambah pelanggan' }).click()
    await expect(page.getByRole('dialog').getByRole('button', { name: 'Simpan' })).toBeDisabled()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
  })
})
