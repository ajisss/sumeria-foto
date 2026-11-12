import AxeBuilder from '@axe-core/playwright'
import { NAV, expect, goto, openNav, test, type Theme } from './helpers'
import type { Page } from '@playwright/test'

async function scan(page: Page, label: string) {
  const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze()
  const summary = res.violations.map((v) => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)
  expect(summary, `axe violations on ${label}`).toEqual([])
}

for (const theme of ['light', 'dark'] as Theme[]) {
  test(`axe ${theme}: login + register`, async ({ page }) => {
    await goto(page, { theme, auth: null })
    await scan(page, `login/${theme}`)
    await page.locator('form + p button').click()
    await page.locator('form button[type=submit]').click()
    await scan(page, `register-errors/${theme}`)
  })

  test(`axe ${theme}: all 12 pages`, async ({ page }) => {
    test.setTimeout(180_000)
    await goto(page, { theme })
    const failures: string[] = []
    for (const n of NAV) {
      await openNav(page, n.id)
      await page.waitForTimeout(400)
      try {
        await scan(page, `${n.key}/${theme}`)
      } catch (e) {
        failures.push(String((e as Error).message).split('\n').slice(0, 14).join('\n'))
      }
    }
    expect(failures.join('\n---\n')).toBe('')
  })

  test(`axe ${theme}: open dialogs`, async ({ page }) => {
    await goto(page, { theme })
    await openNav(page, 'Penawaran')
    await page.getByRole('button', { name: 'Buat penawaran' }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Tambah item' }).click()
    await scan(page, `quotation-dialog/${theme}`)
    await page.keyboard.press('Escape')
    await openNav(page, 'Data Pelanggan')
    await page.getByRole('button', { name: 'Hapus Budi Santoso' }).click()
    await scan(page, `confirm-dialog/${theme}`)
  })
}

test('keyboard: dialog traps focus and closes with Esc; sidebar usable; primary action reachable', async ({ page }) => {
  await goto(page)
  const mobile = (page.viewportSize()?.width ?? 1440) < 768
  test.skip(mobile, 'keyboard Tab-order check is desktop-focused')
  // sidebar item reachable and activates with Enter
  await page.locator('[data-sidebar="menu-button"]').filter({ hasText: /^Data Pelanggan$/ }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Data Pelanggan' }).first()).toBeVisible()
  // Tab from sidebar reaches primary action
  const add = page.getByRole('button', { name: 'Tambah pelanggan' })
  let reached = false
  for (let i = 0; i < 40 && !reached; i++) {
    await page.keyboard.press('Tab')
    reached = await add.evaluate((el) => el === document.activeElement)
  }
  expect(reached, 'Tab reaches "Tambah pelanggan"').toBe(true)
  await page.keyboard.press('Enter')
  const dlg = page.getByRole('dialog')
  await expect(dlg).toBeVisible()
  await expect(dlg.locator('#cust-name')).toBeFocused()
  // focus trap: many tabs never escape the dialog
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab')
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]'))).toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(dlg).toBeHidden()
  // focus returns to trigger
  await expect(add).toBeFocused()

  // confirm dialog Esc
  await page.getByRole('button', { name: 'Hapus Budi Santoso' }).click()
  await expect(page.getByRole('alertdialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('alertdialog')).toBeHidden()
})

test('keyboard: sidebar toggle shortcut and skip of hidden elements on mobile sheet', async ({ page }) => {
  await goto(page)
  const mobile = (page.viewportSize()?.width ?? 1440) < 768
  test.skip(!mobile, 'mobile only')
  await page.getByRole('button', { name: /toggle sidebar/i }).click()
  const sheet = page.getByRole('dialog')
  await expect(sheet).toBeVisible()
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press('Tab')
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]'))).toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(sheet).toBeHidden()
})
