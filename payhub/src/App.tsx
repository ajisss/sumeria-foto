import { Suspense, useCallback, useMemo, useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/app/app-sidebar'
import { BackupDialog } from '@/components/app/backup-dialog'
import { LanguageSwitch } from '@/components/app/language-switch'
import { ThemeToggle } from '@/components/app/theme-toggle'
import { LoginGate } from '@/components/login-gate'
import { useCollection } from '@/hooks/use-collection'
import { useTheme } from '@/hooks/use-theme'
import { AppContext, type AppCtx } from '@/lib/app-context'
import { computeOverdueInvoices } from '@/lib/calc'
import type { TabKey } from '@/lib/constants'
import { logout as authLogout, readSession, type Session } from '@/lib/auth'
import { storage } from '@/lib/storage'
import type { Customer, Expense, Invoice, Quotation } from '@/lib/types'
import { I18nProvider } from '@/i18n'
import { LazyPrintView, PAGES, PageFallback } from '@/pages'

function MainApp({ email, name, onLogout, dark, toggleTheme }: { email: string; name?: string; onLogout: () => void; dark: boolean; toggleTheme: () => void }) {
  const [customers, setCustomers] = useCollection<Customer>('payhub_customers')
  const [quotations, setQuotations] = useCollection<Quotation>('payhub_quotations')
  const [invoices, setInvoices] = useCollection<Invoice>('payhub_invoices')
  const [expenses, setExpenses] = useCollection<Expense>('payhub_expenses')

  const [tab, setTab] = useState<TabKey>('home')
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [detailCustomerId, setDetailCustomerId] = useState<string | null>(null)
  const [printTarget, setPrintTarget] = useState<AppCtx['setPrintTarget'] extends (t: infer T) => void ? T : never>(null)
  const [backupOpen, setBackupOpen] = useState(false)
  const [lastBackup, setLastBackup] = useState<string | null>(() => storage.get('payhub_last_backup'))

  const overdueInvoices = useMemo(() => computeOverdueInvoices(invoices), [invoices])

  const markBackupDone = useCallback(() => {
    const now = new Date().toISOString()
    storage.set('payhub_last_backup', now)
    setLastBackup(now)
  }, [])

  const ctx: AppCtx = {
    customers, setCustomers, quotations, setQuotations, invoices, setInvoices, expenses, setExpenses,
    overdueInvoices, tab, setTab, selectedInvoiceId, setSelectedInvoiceId, detailCustomerId, setDetailCustomerId,
    setPrintTarget, markBackupDone,
  }

  if (printTarget) {
    return (
      <AppContext.Provider value={ctx}>
        <Suspense fallback={<PageFallback />}>
          <LazyPrintView target={printTarget} onClose={() => setPrintTarget(null)} />
        </Suspense>
      </AppContext.Provider>
    )
  }

  const Page = PAGES[tab]
  return (
    <AppContext.Provider value={ctx}>
      <SidebarProvider>
        <AppSidebar
          tab={tab}
          setTab={setTab}
          email={email}
          name={name}
          overdueCount={overdueInvoices.length}
          lastBackup={lastBackup}
          onBackup={() => setBackupOpen(true)}
          onLogout={onLogout}
        />
        <SidebarInset>
          <header className="flex h-14 items-center justify-between gap-2 border-b px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <LanguageSwitch />
              <ThemeToggle dark={dark} toggle={toggleTheme} />
            </div>
          </header>
          <div className="flex-1 p-4 md:p-8">
            <Suspense fallback={<PageFallback />}>
              <Page />
            </Suspense>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <BackupDialog
        open={backupOpen}
        onClose={() => setBackupOpen(false)}
        customers={customers}
        quotations={quotations}
        invoices={invoices}
        expenses={expenses}
        onBackedUp={markBackupDone}
        onRestore={(d) => {
          setCustomers(d.customers)
          setQuotations(d.quotations)
          setInvoices(d.invoices)
          setExpenses(d.expenses)
        }}
      />
    </AppContext.Provider>
  )
}

export default function App() {
  const { dark, toggle } = useTheme()
  // Legacy sessions ({email, loggedAt}) are still honoured by readSession().
  const [auth, setAuth] = useState<Session | null>(readSession)

  function logout() {
    void authLogout()
    setAuth(null)
  }

  return (
    <I18nProvider>
      <TooltipProvider>
        {auth ? <MainApp email={auth.email} name={auth.name} onLogout={logout} dark={dark} toggleTheme={toggle} /> : <LoginGate onAuthenticated={setAuth} dark={dark} toggleTheme={toggle} />}
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </I18nProvider>
  )
}
