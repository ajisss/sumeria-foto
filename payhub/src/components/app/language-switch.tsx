import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n'

export function LanguageSwitch() {
  const { lang, setLang, t } = useI18n()
  const next = lang === 'id' ? 'en' : 'id'
  return (
    <Button variant="outline" size="sm" onClick={() => setLang(next)} aria-label={t('language')} title={t('language')}>
      <Languages />
      {lang.toUpperCase()}
    </Button>
  )
}
