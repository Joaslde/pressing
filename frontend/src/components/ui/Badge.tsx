import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-neutral-100 text-neutral-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-green-100 text-success',
  warning: 'bg-amber-100 text-warning',
  danger: 'bg-red-100 text-danger',
  info: 'bg-blue-100 text-info',
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className
      )}
      {...props}
    />
  )
}

/** Maps order status keys to a sensible badge tone for quick visual scanning. */
export function orderStatusTone(status: string): Tone {
  switch (status) {
    case 'draft':
      return 'neutral'
    case 'pending_payment':
    case 'awaiting_balance':
      return 'warning'
    case 'cancelled':
      return 'danger'
    case 'completed':
    case 'delivered':
      return 'success'
    default:
      return 'info'
  }
}

export function paymentStatusTone(status: string): Tone {
  switch (status) {
    case 'paid':
      return 'success'
    case 'failed':
      return 'danger'
    case 'unpaid':
      return 'neutral'
    default:
      return 'warning'
  }
}
