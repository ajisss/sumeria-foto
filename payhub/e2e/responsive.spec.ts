import { NAV, expect, goto, noHScroll, openNav, test } from './helpers'

test('no horizontal page scroll on any page (seeded)', async ({ page }) => {
  test.setTimeout(120_000)
  await goto(page)
  for (const n of NAV) {
    await openNav(page, n.id)
    await page.waitForTimeout(300)
    await noHScroll(page)
  }
})

test('wide tables scroll inside their container, not the page', async ({ page }) => {
  await goto(page)
  const mobile = (page.viewportSize()?.width ?? 1440) < 768
  for (const name of ['Invoice', 'Penawaran', 'Margin Proyek', 'Pemasukan & Pengeluaran']) {
    await openNav(page, name)
    await page.waitForTimeout(300)
    const info = await page.locator('table').first().evaluate((tbl) => {
      let el: HTMLElement | null = tbl.parentElement
      while (el && getComputedStyle(el).overflowX !== 'auto' && getComputedStyle(el).overflowX !== 'scroll') el = el.parentElement
      return el ? { scrolls: el.scrollWidth > el.clientWidth, cw: el.clientWidth, sw: el.scrollWidth } : null
    })
    expect(info, `${name}: table has overflow-x container`).not.toBeNull()
    if (mobile) expect(info!.scrolls, `${name} table should scroll within container on mobile`).toBe(true)
    await noHScroll(page)
  }
})

test('dialogs fit the viewport (no page overflow) on mobile', async ({ page }) => {
  await goto(page)
  await openNav(page, 'Penawaran')
  await page.getByRole('button', { name: 'Buat penawaran' }).click()
  const dlg = page.getByRole('dialog')
  await dlg.getByRole('button', { name: 'Tambah item' }).click()
  await noHScroll(page)
  const box = await dlg.boundingBox()
  const vw = page.viewportSize()!.width
  expect(box!.x).toBeGreaterThanOrEqual(-1)
  expect(box!.x + box!.width).toBeLessThanOrEqual(vw + 1)
  await page.keyboard.press('Escape')
  await openNav(page, 'Invoice')
  await page.locator('tbody tr').first().getByRole('button', { name: 'Ubah' }).click()
  await noHScroll(page)
  const b2 = await page.getByRole('dialog').boundingBox()
  expect(b2!.x + b2!.width).toBeLessThanOrEqual(vw + 1)
})
