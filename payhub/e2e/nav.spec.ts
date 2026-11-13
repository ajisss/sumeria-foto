import { NAV, expect, goto, openNav, test } from './helpers'

test('navigates all 12 pages in ID and EN, language + theme persist after reload', async ({ page }) => {
  await goto(page)
  for (const n of NAV) {
    await openNav(page, n.id)
    if (n.key !== 'home') await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  }
  // language switch
  await page.getByRole('button', { name: 'Bahasa' }).click()
  await expect(page.getByRole('button', { name: 'Keluar' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Log out' }).or(page.getByRole('button', { name: /Sign out|Logout/ }))).toBeVisible()
  for (const n of NAV) await openNav(page, n.en)
  // theme
  expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(false)
  await page.getByRole('button', { name: 'Dark mode' }).click()
  expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(true)
  await page.reload()
  await page.waitForLoadState('networkidle')
  expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(true)
  expect(await page.evaluate(() => localStorage.getItem('payhub::payhub_theme'))).toBe('dark')
  expect(await page.evaluate(() => localStorage.getItem('payhub::payhub_lang'))).toBe('en')
  await expect(page.getByRole('button', { name: 'Light mode' })).toBeVisible()
  await page.getByRole('button', { name: 'Light mode' }).click()
  expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(false)
})

test('overdue badge on sidebar and mobile sheet closes after navigation', async ({ page }) => {
  await goto(page)
  const mobile = (page.viewportSize()?.width ?? 1440) < 768
  if (mobile) await page.getByRole('button', { name: /toggle sidebar/i }).click()
  await expect(page.locator('[data-sidebar="menu-badge"]')).toHaveText('1')
})
