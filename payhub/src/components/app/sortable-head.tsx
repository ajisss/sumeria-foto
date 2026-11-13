import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TableHead } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface SortState {
  key: string
  dir: 'asc' | 'desc'
}

export function SortableHead({
  label,
  sortKey,
  sort,
  setSort,
  className,
}: {
  label: string
  sortKey: string
  sort: SortState
  setSort: (s: SortState) => void
  className?: string
}) {
  const active = sort.key === sortKey
  const Icon = !active ? ChevronsUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown
  return (
    <TableHead className={className} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 h-7 gap-1 px-2 font-medium"
        onClick={() => setSort({ key: sortKey, dir: active && sort.dir === 'asc' ? 'desc' : 'asc' })}
      >
        {label}
        <Icon className={cn('size-3.5', !active && 'opacity-40')} />
      </Button>
    </TableHead>
  )
}
