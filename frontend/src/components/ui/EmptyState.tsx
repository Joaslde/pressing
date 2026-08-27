import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-300 px-6 py-12 text-center">
      {icon && <div className="text-neutral-400">{icon}</div>}
      <div>
        <p className="text-sm font-medium text-neutral-800">{title}</p>
        {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
      </div>
      {action}
    </div>
  )
}
