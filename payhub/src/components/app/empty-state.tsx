import type { ReactNode } from 'react'

export function EmptyState({ text, action }: { text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
      <p>{text}</p>
      {action}
    </div>
  )
}
