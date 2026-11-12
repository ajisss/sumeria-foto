import { Skeleton } from '@/components/ui/skeleton'

/** Suspense fallback untuk halaman yang dimuat lazy: kerangka header + kartu + tabel. */
export function PageFallback() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6" role="status" aria-busy="true">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  )
}
