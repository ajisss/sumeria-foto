import { useEffect, useState } from 'react'
import { storage } from '@/lib/storage'

export function useTheme() {
  const [dark, setDark] = useState(() => storage.get('payhub_theme') === 'dark')
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    storage.set('payhub_theme', dark ? 'dark' : 'light')
  }, [dark])
  return { dark, toggle: () => setDark((d) => !d) }
}
