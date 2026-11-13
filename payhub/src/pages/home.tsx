import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { NAV_ICONS } from '@/components/app/app-sidebar'
import { NAV_KEYS } from '@/lib/constants'
import { useApp } from '@/lib/app-context'
import { useT } from '@/i18n'
import logo from '@/assets/logo.png'

export default function HomePage() {
  const { setTab } = useApp()
  const t = useT()
  const tiles = NAV_KEYS.filter((k) => k !== 'home')
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Sumériapoto" className="h-6 w-auto dark:invert" />
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">PayHub</span>
      </div>
      <p className="text-sm text-muted-foreground">{t('ov_home_subtitle')}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tiles.map((key) => {
          const Icon = NAV_ICONS[key]
          return (
            <Button
              key={key}
              type="button"
              variant="ghost"
              onClick={() => setTab(key)}
              className="block h-auto w-full whitespace-normal rounded-xl p-0 text-left font-normal transition-transform hover:bg-transparent active:scale-95"
            >
              <Card className="h-full transition-colors hover:bg-accent">
                <CardContent className="flex flex-col items-start gap-4">
                  <span className="flex size-9 items-center justify-center rounded-lg border bg-muted text-foreground">
                    <Icon className="size-[18px]" strokeWidth={1.75} />
                  </span>
                  <span className="text-sm font-medium leading-tight">{t(`nav_${key}` as const)}</span>
                </CardContent>
              </Card>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
