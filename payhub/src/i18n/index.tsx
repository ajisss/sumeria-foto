import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import en from './en'
import { extraEn, extraId } from './extra'
import id from './id'
import type { MessageKey } from './keys'
import { storage } from '@/lib/storage'

export type Lang = 'id' | 'en'
export type { MessageKey }

const dictionaries: Record<Lang, Record<string, string>> = { id: { ...id, ...extraId }, en: { ...en, ...extraEn } }

type Params = Record<string, string | number>
export type TFn = (key: MessageKey, params?: Params) => string

interface I18nValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: TFn
}

const I18nContext = createContext<I18nValue | null>(null)

function format(template: string, params?: Params) {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`))
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (storage.get('payhub_lang') === 'en' ? 'en' : 'id'))

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang: (l) => {
        storage.set('payhub_lang', l)
        setLangState(l)
      },
      t: (key, params) => format(dictionaries[lang][key] ?? dictionaries.id[key] ?? key, params),
    }),
    [lang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}

export const useT = () => useI18n().t
