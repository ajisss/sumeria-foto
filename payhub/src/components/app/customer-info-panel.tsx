import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/app-context'
import type { Customer } from '@/lib/types'
import { useT } from '@/i18n'

/** Ringkasan customer terpilih. `onNavigate` dipanggil sebelum pindah ke halaman customer (mis. tutup modal). */
export function CustomerInfoPanel({ customer, onNavigate }: { customer?: Customer; onNavigate?: () => void }) {
  const t = useT()
  const { setDetailCustomerId, setTab } = useApp()
  if (!customer) return null
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border bg-muted/50 px-4 py-3 text-sm">
      <div className="grid flex-1 gap-x-4 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="font-semibold">{customer.name}</div>
        <div className="text-muted-foreground">{customer.phone}</div>
        <div className="break-all text-muted-foreground">{customer.email}</div>
        <div className="text-muted-foreground">{customer.city}</div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t('sales_view_customer')}
        title={t('sales_view_customer')}
        onClick={() => {
          onNavigate?.()
          setDetailCustomerId(customer.id)
          setTab('customers')
        }}
      >
        <ExternalLink />
      </Button>
    </div>
  )
}
