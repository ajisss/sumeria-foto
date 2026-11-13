import { lazy, type ComponentProps, type ComponentType, type LazyExoticComponent } from 'react'
import type { TabKey } from '@/lib/constants'

export { PageFallback } from './page-fallback'

/** Halaman dimuat on-demand (satu chunk per halaman). Bungkus render dengan <Suspense fallback={<PageFallback />}>. */
export const PAGES: Record<TabKey, LazyExoticComponent<ComponentType>> = {
  home: lazy(() => import('./home')),
  customers: lazy(() => import('./customers')),
  quotations: lazy(() => import('./quotations')),
  invoices: lazy(() => import('./invoices')),
  orders: lazy(() => import('./orders')),
  orderDetails: lazy(() => import('./order-details')),
  calendar: lazy(() => import('./calendar')),
  expenses: lazy(() => import('./expenses')),
  ledger: lazy(() => import('./ledger')),
  margin: lazy(() => import('./margin')),
  bestsellers: lazy(() => import('./bestsellers')),
  masterDashboard: lazy(() => import('./dashboard')),
}

type PrintViewProps = ComponentProps<typeof import('@/components/print-view').PrintView>

/** PrintView (+ PrintDocument) lazy: hanya dimuat saat dokumen dibuka. */
export const LazyPrintView: LazyExoticComponent<ComponentType<PrintViewProps>> = lazy(() =>
  import('@/components/print-view').then((m) => ({ default: m.PrintView })),
)
