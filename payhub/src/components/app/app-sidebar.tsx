import { Award, ArrowLeftRight, BarChart3, Calendar, ClipboardList, Handshake, Home, LogOut, Receipt, Save, ShoppingBag, TrendingUp, Users, Wallet, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { NAV_KEYS, type TabKey } from '@/lib/constants'
import { useI18n } from '@/i18n'

export const NAV_ICONS: Record<TabKey, LucideIcon> = {
  home: Home,
  customers: Users,
  quotations: Handshake,
  invoices: Receipt,
  orders: ShoppingBag,
  orderDetails: ClipboardList,
  calendar: Calendar,
  expenses: Wallet,
  ledger: ArrowLeftRight,
  margin: TrendingUp,
  bestsellers: Award,
  masterDashboard: BarChart3,
}

interface Props {
  tab: TabKey
  setTab: (t: TabKey) => void
  email: string
  name?: string
  overdueCount: number
  lastBackup: string | null
  onBackup: () => void
  onLogout: () => void
}

function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 864e5)
}

export function AppSidebar({ tab, setTab, email, name, overdueCount, lastBackup, onBackup, onLogout }: Props) {
  const { t } = useI18n()
  const { isMobile, setOpenMobile } = useSidebar()
  const stale = !lastBackup || daysSince(lastBackup) > 7

  let backupText = t('backup_never')
  if (lastBackup) {
    const d = daysSince(lastBackup)
    backupText = d === 0 ? t('i18n_backup_last_today') : t('i18n_backup_last_days', { days: d })
  }

  return (
    <Sidebar>
      <SidebarHeader className="px-4 pt-5 pb-3">
        <p className="text-lg font-semibold uppercase tracking-[0.1em]">Sumériapoto</p>
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">{t('tagline')}</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_KEYS.map((key) => {
                const Icon = NAV_ICONS[key]
                return (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton
                      isActive={tab === key}
                      onClick={() => {
                        setTab(key)
                        if (isMobile) setOpenMobile(false)
                      }}
                    >
                      <Icon />
                      <span>{t(`nav_${key}` as const)}</span>
                    </SidebarMenuButton>
                    {key === 'masterDashboard' && overdueCount > 0 && <SidebarMenuBadge>{overdueCount}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-2 p-3">
        <Button variant="outline" className={stale ? 'justify-start border-destructive/40 text-destructive' : 'justify-start'} onClick={onBackup}>
          <Save />
          {t('backup_restore')}
        </Button>
        <p className={stale ? 'px-1 text-xs text-destructive' : 'px-1 text-xs text-muted-foreground'}>{backupText}</p>
        <p className="truncate px-1 text-xs text-muted-foreground" title={email}>
          {name || email}
        </p>
        <Button variant="outline" className="justify-start" onClick={onLogout}>
          <LogOut />
          {t('logout')}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

