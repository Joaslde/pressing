import { IconCheck } from '@/components/ui/icons'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'
import type { OrderStatus } from '@/types'

const HAPPY_PATH: Array<{ status: OrderStatus; label: string }> = [
  { status: 'confirmed', label: 'Confirmée' },
  { status: 'pickup_scheduled', label: 'Collecte planifiée' },
  { status: 'picked_up', label: 'Collectée' },
  { status: 'processing', label: 'En traitement' },
  { status: 'ready', label: 'Prête' },
  { status: 'delivery_scheduled', label: 'Livraison planifiée' },
  { status: 'out_for_delivery', label: 'En livraison' },
  { status: 'delivered', label: 'Livrée' },
]

interface OrderStatusTimelineProps {
  status: OrderStatus
  statusLabel: string
}

export function OrderStatusTimeline({ status, statusLabel }: OrderStatusTimelineProps) {
  if (status === 'cancelled') {
    return <Badge tone="danger">Commande annulée</Badge>
  }

  if (status === 'draft' || status === 'pending_payment') {
    return <Badge tone="warning">{statusLabel}</Badge>
  }

  const effectiveStatus = status === 'awaiting_balance' ? 'ready' : status === 'completed' ? 'delivered' : status
  const currentIndex = HAPPY_PATH.findIndex((step) => step.status === effectiveStatus)

  return (
    <ol className="flex flex-col gap-0" aria-label="Suivi de la commande">
      {HAPPY_PATH.map((step, index) => {
        const isDone = index < currentIndex
        const isCurrent = index === currentIndex
        const isLast = index === HAPPY_PATH.length - 1

        return (
          <li key={step.status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                  isDone || isCurrent ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-400'
                )}
              >
                {isDone ? <IconCheck width={13} height={13} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
              </span>
              {!isLast && (
                <div className={cn('w-0.5 flex-1 py-1', isDone ? 'bg-primary-600' : 'bg-neutral-200')} style={{ minHeight: 20 }} />
              )}
            </div>
            <p
              className={cn(
                'pb-5 text-sm',
                isCurrent && 'font-semibold text-neutral-900',
                isDone && 'text-neutral-500',
                !isDone && !isCurrent && 'text-neutral-400'
              )}
            >
              {step.label}
              {status === 'awaiting_balance' && step.status === 'ready' && (
                <span className="ml-2 text-xs font-normal text-warning">(en attente du solde)</span>
              )}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
