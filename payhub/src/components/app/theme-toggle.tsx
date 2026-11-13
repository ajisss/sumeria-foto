import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n'

export function ThemeToggle({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  const t = useT()
  const label = t(dark ? 'light_mode' : 'dark_mode')
  return (
    <Button variant="outline" size="icon" onClick={toggle} aria-label={label} title={label}>
      {dark ? <Sun /> : <Moon />}
    </Button>
  )
}
