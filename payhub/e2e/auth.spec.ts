import { expect, goto, test } from './helpers'

const PW = 'S3cretPassw0rd!'

async function toRegister(page: import('@playwright/test').Page) {
  await page.locator('form + p button').click()
  await expect(page.locator('#auth-confirm')).toBeVisible()
}

test.describe('auth', () => {
  test('register validation, eye toggles, success, no plaintext password, logout, duplicate, login errors/success', async ({ page }) => {
    await goto(page, { auth: null, data: 'empty' })
    await toRegister(page)

    // empty submit -> name/email/password errors
    await page.locator('form button[type=submit]').click()
    await expect(page.getByText('Nama wajib diisi.')).toBeVisible()
    await expect(page.getByText('Masukkan alamat email yang valid.')).toBeVisible()
    await expect(page.getByText('Kata sandi wajib diisi.')).toBeVisible()

    // bad email
    await page.locator('#auth-name').fill('Tester')
    await page.locator('#auth-email').fill('bukan-email')
    await page.locator('#auth-password').fill('abc')
    await page.locator('#auth-confirm').fill('abc')
    await page.locator('form button[type=submit]').click()
    await expect(page.getByText('Masukkan alamat email yang valid.')).toBeVisible()
    await expect(page.getByText('Kata sandi minimal 8 karakter.')).toBeVisible()

    // mismatch
    await page.locator('#auth-email').fill('tester@example.com')
    await page.locator('#auth-password').fill(PW)
    await page.locator('#auth-confirm').fill(PW + 'x')
    await page.locator('form button[type=submit]').click()
    await expect(page.getByText('Konfirmasi kata sandi tidak sama.')).toBeVisible()

    // eye toggles are independent
    const eyes = page.getByRole('button', { name: 'Tampilkan kata sandi' })
    await expect(eyes).toHaveCount(2)
    await eyes.first().click()
    await expect(page.locator('#auth-password')).toHaveAttribute('type', 'text')
    await expect(page.locator('#auth-confirm')).toHaveAttribute('type', 'password')
    await page.getByRole('button', { name: 'Tampilkan kata sandi' }).click()
    await expect(page.locator('#auth-confirm')).toHaveAttribute('type', 'text')
    await page.getByRole('button', { name: 'Sembunyikan kata sandi' }).first().click()
    await expect(page.locator('#auth-password')).toHaveAttribute('type', 'password')

    // success
    await page.locator('#auth-confirm').fill(PW)
    await page.locator('form button[type=submit]').click()
    await expect(page.getByRole('button', { name: 'Keluar' })).toBeVisible()
    const dump = await page.evaluate(() => JSON.stringify({ ...localStorage }))
    expect(dump).not.toContain(PW)
    expect(dump).toContain('payhub::payhub_users')
    expect(dump).toContain('hash')

    // logout
    await page.getByRole('button', { name: 'Keluar' }).click()
    await expect(page.locator('#auth-email')).toBeVisible()
    expect(await page.evaluate(() => localStorage.getItem('payhub::payhub_auth'))).toBeNull()

    // duplicate register
    await toRegister(page)
    await page.locator('#auth-name').fill('Dup')
    await page.locator('#auth-email').fill('TESTER@example.com')
    await page.locator('#auth-password').fill(PW)
    await page.locator('#auth-confirm').fill(PW)
    await page.locator('form button[type=submit]').click()
    await expect(page.getByText('Email ini sudah terdaftar. Silakan masuk.')).toBeVisible()

    // back to login; wrong password then right
    await page.locator('form + p button').click()
    await page.locator('#auth-email').fill('tester@example.com')
    await page.locator('#auth-password').fill('salah-salah')
    await page.locator('form button[type=submit]').click()
    await expect(page.getByText('Email atau kata sandi salah.')).toBeVisible()
    await page.locator('#auth-password').fill(PW)
    await page.locator('form button[type=submit]').click()
    await expect(page.getByRole('button', { name: 'Keluar' })).toBeVisible()
    await expect(page.getByText('Tester', { exact: true })).toBeVisible()

    // session survives reload
    await page.reload()
    await expect(page.getByRole('button', { name: 'Keluar' })).toBeVisible()
  })

  test('unknown email shows generic invalid credentials', async ({ page }) => {
    await goto(page, { auth: null, data: 'empty' })
    await page.locator('#auth-email').fill('nobody@example.com')
    await page.locator('#auth-password').fill('whatever123')
    await page.locator('form button[type=submit]').click()
    await expect(page.getByText('Email atau kata sandi salah.')).toBeVisible()
  })

  test('legacy session without users/name still enters the app', async ({ page }) => {
    await goto(page, { auth: { email: 'old@example.com', loggedAt: '2024-01-01T00:00:00.000Z' } })
    await expect(page.getByRole('button', { name: 'Keluar' })).toBeVisible()
    await expect(page.getByText('old@example.com')).toBeVisible()
  })

  test('english auth copy', async ({ page }) => {
    await goto(page, { auth: null, lang: 'en', data: 'empty' })
    await expect(page.getByText('Sign in to your account')).toBeVisible()
    await page.locator('#auth-email').fill('x')
    await page.locator('form button[type=submit]').click()
    await expect(page.getByText('Enter a valid email address.')).toBeVisible()
  })
})
