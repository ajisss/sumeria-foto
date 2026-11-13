import { NAV, expect, goto, noHScroll, openNav, test, SHOTS, type Lang, type Theme } from './helpers'

const langs: Lang[] = ['id', 'en']
const themes: Theme[] = ['light', 'dark']

for (const lang of langs) {
  for (const theme of themes) {
    test(`screenshots ${lang}-${theme}: all pages`, async ({ page }, info) => {
      test.setTimeout(180_000)
      const vp = info.project.name
      await goto(page, { lang, theme })
      for (const n of NAV) {
        await openNav(page, n[lang])
        await page.waitForTimeout(500)
        await expect(page.locator('[data-slot=sidebar-inset]')).toBeVisible()
        await noHScroll(page)
        await page.screenshot({ path: `${SHOTS}/${lang}-${theme}-${vp}-${n.key}.png`, fullPage: true })
      }
    })

    test(`screenshots ${lang}-${theme}: auth pages`, async ({ page }, info) => {
      const vp = info.project.name
      await goto(page, { lang, theme, auth: null })
      await expect(page.locator('#auth-email')).toBeVisible()
      await noHScroll(page)
      await page.screenshot({ path: `${SHOTS}/${lang}-${theme}-${vp}-login.png`, fullPage: true })
      await page.locator('form + p button').click()
      await expect(page.locator('#auth-confirm')).toBeVisible()
      await noHScroll(page)
      await page.getByRole('button', { name: /^(Daftar|Create|Register|Sign up)/i }).last().click()
      await page.screenshot({ path: `${SHOTS}/${lang}-${theme}-${vp}-register.png`, fullPage: true })
    })
  }
}

for (const lang of langs) {
  test(`screenshots empty database ${lang}`, async ({ page }, info) => {
    test.setTimeout(180_000)
    const vp = info.project.name
    await goto(page, { lang, theme: 'light', data: 'empty' })
    for (const n of NAV) {
      await openNav(page, n[lang])
      await page.waitForTimeout(300)
      await noHScroll(page)
      await page.screenshot({ path: `${SHOTS}/${lang}-empty-${vp}-${n.key}.png`, fullPage: true })
    }
  })
}
