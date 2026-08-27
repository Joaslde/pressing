import { useToastStore } from './toastStore'
import { cn } from '@/lib/cn'

const toneClasses = {
  success: 'border-l-4 border-l-success',
  error: 'border-l-4 border-l-danger',
  info: 'border-l-4 border-l-info',
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={cn(
            'flex items-start gap-3 rounded-lg bg-white p-4 shadow-lg ring-1 ring-neutral-200',
            toneClasses[toast.tone]
          )}
        >
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-900">{toast.title}</p>
            {toast.description && (
              <p className="mt-0.5 text-sm text-neutral-500">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            aria-label="Fermer la notification"
            className="text-neutral-400 hover:text-neutral-600"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
