import { useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { ACTION_ICONS } from '@/components/app/action-icons'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { LanguageSwitch } from '@/components/app/language-switch'
import { PasswordInput } from '@/components/app/password-input'
import { ThemeToggle } from '@/components/app/theme-toggle'
import { AuthError, EMAIL_RE, MIN_PASSWORD_LENGTH, login, register, type Session } from '@/lib/auth'
import { useT, type TFn } from '@/i18n'

type Mode = 'login' | 'register'
type Errors = Partial<Record<'name' | 'email' | 'password' | 'form', string>>

function authMessage(e: unknown, t: TFn): Errors {
  const code = e instanceof AuthError ? e.code : 'unknown'
  switch (code) {
    case 'invalid_credentials':
      return { password: t('auth_err_invalid_credentials') }
    case 'email_taken':
      return { email: t('auth_err_email_taken') }
    case 'invalid_email':
      return { email: t('auth_err_email') }
    case 'weak_password':
      return { password: t('auth_err_password_short') }
    default:
      return { form: t('auth_err_unknown') }
  }
}

export function LoginGate({ onAuthenticated, dark, toggleTheme }: { onAuthenticated: (s: Session) => void; dark: boolean; toggleTheme: () => void }) {
  const t = useT()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)
  const isRegister = mode === 'register'

  function clear(key: keyof Errors) {
    if (errors[key] || errors.form) setErrors((cur) => ({ ...cur, [key]: undefined, form: undefined }))
  }

  function switchMode(next: Mode = isRegister ? 'login' : 'register') {
    if (next === mode) return
    setMode(next)
    setErrors({})
    setPassword('')
  }

  function validate(): Errors {
    const e: Errors = {}
    if (isRegister && !name.trim()) e.name = t('auth_err_name')
    if (!EMAIL_RE.test(email.trim())) e.email = t('auth_err_email')
    if (!password) e.password = t('auth_err_password_required')
    else if (isRegister && password.length < MIN_PASSWORD_LENGTH) e.password = t('auth_err_password_short')
    return e
  }

  async function submit(ev: FormEvent) {
    ev.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) return
    setBusy(true)
    try {
      const session = isRegister ? await register({ name, email, password }) : await login({ email, password })
      onAuthenticated(session)
    } catch (err) {
      setErrors(authMessage(err, t))
      setBusy(false)
    }
  }

  const SubmitIcon = isRegister ? ACTION_ICONS.register : ACTION_ICONS.login
  const submitLabel = isRegister ? (busy ? t('auth_register_busy') : t('auth_register_submit')) : busy ? t('auth_login_busy') : t('auth_login_submit')

  const LoginIcon = ACTION_ICONS.login
  const RegisterIcon = ACTION_ICONS.register

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4 sm:p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border bg-card shadow-xl lg:min-h-[640px] lg:grid-cols-2">
        <aside className="relative m-2.5 hidden flex-col justify-between overflow-hidden rounded-2xl bg-neutral-950 p-8 text-white lg:flex">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,oklch(0.45_0.09_165/0.55),transparent_60%),radial-gradient(90%_70%_at_100%_100%,oklch(0.4_0.1_250/0.5),transparent_60%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          />
          <div className="relative">
            <p className="text-xl font-semibold uppercase tracking-[0.12em]">Sumériapoto</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.3em] text-white/70">{t('tagline')}</p>
          </div>
          <figure className="relative rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
            <blockquote className="text-lg leading-snug">&ldquo;{t('auth_panel_quote')}&rdquo;</blockquote>
            <figcaption className="mt-5">
              <p className="text-base font-semibold">{t('auth_panel_name')}</p>
              <p className="text-sm text-white/80">{t('auth_panel_role')}</p>
            </figcaption>
          </figure>
        </aside>

        <main className="relative flex flex-col justify-center px-6 py-14 sm:px-12">
          <div className="absolute right-4 top-4 flex gap-2">
            <LanguageSwitch />
            <ThemeToggle dark={dark} toggle={toggleTheme} />
          </div>
          <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
            <p className="text-center text-lg font-semibold uppercase tracking-[0.12em] lg:hidden">Sumériapoto</p>
            <Tabs value={mode} onValueChange={(v) => switchMode(v as Mode)} className="items-center">
              <TabsList>
                <TabsTrigger value="login" disabled={busy}>
                  <LoginIcon />
                  {t('auth_login_submit')}
                </TabsTrigger>
                <TabsTrigger value="register" disabled={busy}>
                  <RegisterIcon />
                  {t('auth_register_submit')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight">{isRegister ? t('auth_register_title') : t('auth_login_title')}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{isRegister ? t('auth_register_subtitle') : t('auth_login_subtitle')}</p>
            </div>
            <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
              {isRegister && (
                <Field data-invalid={!!errors.name}>
                  <FieldLabel htmlFor="auth-name">{t('auth_name_label')}</FieldLabel>
                  <Input
                    id="auth-name"
                    autoComplete="name"
                    autoFocus
                    className="h-10"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      clear('name')
                    }}
                    placeholder={t('auth_name_placeholder')}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <FieldError>{errors.name}</FieldError>}
                </Field>
              )}
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="auth-email">{t('login_email_label')}</FieldLabel>
                <Input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  autoFocus={!isRegister}
                  className="h-10"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    clear('email')
                  }}
                  placeholder={t('login_email_placeholder')}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <FieldError>{errors.email}</FieldError>}
              </Field>
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="auth-password">{t('auth_password_label')}</FieldLabel>
                <PasswordInput
                  id="auth-password"
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  className="h-10"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    clear('password')
                  }}
                  placeholder={isRegister ? t('auth_password_placeholder') : undefined}
                  aria-invalid={!!errors.password}
                />
                {errors.password && <FieldError>{errors.password}</FieldError>}
              </Field>
              {errors.form && <FieldError>{errors.form}</FieldError>}
              <Button type="submit" size="lg" className="h-11 w-full" disabled={busy}>
                {busy ? <Loader2 className="animate-spin" /> : <SubmitIcon />}
                {submitLabel}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
              {isRegister ? t('auth_to_login_prompt') : t('auth_to_register_prompt')}{' '}
              <Button type="button" variant="link" className="h-auto p-0" onClick={() => switchMode()} disabled={busy}>
                {isRegister ? t('auth_to_login_link') : t('auth_to_register_link')}
              </Button>
            </p>
            <p className="text-center text-xs text-muted-foreground">{t('login_footer')}</p>
          </div>
        </main>
      </div>
    </div>
  )
}
