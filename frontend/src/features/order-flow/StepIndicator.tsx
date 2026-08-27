import { cn } from '@/lib/cn'
import { IconCheck } from '@/components/ui/icons'

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <ol className="flex items-center gap-1 overflow-x-auto pb-1" aria-label="Étapes de la commande">
      {steps.map((label, index) => {
        const isDone = index < currentStep
        const isCurrent = index === currentStep

        return (
          <li key={label} className="flex shrink-0 items-center gap-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                  isDone && 'bg-primary-600 text-white',
                  isCurrent && 'bg-primary-100 text-primary-700 ring-2 ring-primary-500',
                  !isDone && !isCurrent && 'bg-neutral-100 text-neutral-400'
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isDone ? <IconCheck width={14} height={14} /> : index + 1}
              </span>
              <span
                className={cn(
                  'hidden text-xs font-medium sm:inline',
                  isCurrent ? 'text-neutral-900' : 'text-neutral-400'
                )}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && <div className="mx-2 h-px w-6 bg-neutral-200 sm:w-10" />}
          </li>
        )
      })}
    </ol>
  )
}
