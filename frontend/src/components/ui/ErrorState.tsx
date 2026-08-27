import { Button } from './Button'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Une erreur est survenue',
  description = "Impossible de charger ces données pour le moment.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50 px-6 py-10 text-center">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-danger">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
      </svg>
      <div>
        <p className="text-sm font-medium text-neutral-800">{title}</p>
        <p className="mt-1 text-sm text-neutral-500">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Réessayer
        </Button>
      )}
    </div>
  )
}
