import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonText } from '@/components/ui/Skeleton'
import { IconClock } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import { useTimeSlots } from '@/features/catalog/useCatalog'

interface ScheduleStepProps {
  pickupDate: string | null
  timeSlotId: number | null
  onDateChange: (date: string) => void
  onSlotChange: (id: number) => void
  onBack: () => void
  onNext: () => void
}

function tomorrowISO() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export function ScheduleStep({
  pickupDate,
  timeSlotId,
  onDateChange,
  onSlotChange,
  onBack,
  onNext,
}: ScheduleStepProps) {
  const { data: slots, isLoading, isError, refetch } = useTimeSlots(pickupDate ?? undefined)

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Date et créneau de collecte</h2>
      <p className="mt-1 text-sm text-neutral-500">Choisissez quand nous devons passer chez vous.</p>

      <div className="mt-6 max-w-xs">
        <Input
          label="Date de collecte"
          type="date"
          required
          min={tomorrowISO()}
          value={pickupDate ?? ''}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      {pickupDate && (
        <div className="mt-5">
          {isLoading && <SkeletonText lines={3} />}
          {isError && <ErrorState onRetry={() => refetch()} />}

          {slots && slots.length === 0 && (
            <EmptyState title="Aucun créneau disponible à cette date" description="Essayez une autre date." />
          )}

          {slots && slots.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {slots.map((slot) => {
                const selected = slot.id === timeSlotId
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => onSlotChange(slot.id)}
                    aria-pressed={selected}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors',
                      selected
                        ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    )}
                  >
                    <IconClock
                      width={18}
                      height={18}
                      className={selected ? 'text-primary-600' : 'text-neutral-400'}
                    />
                    <span className="text-sm font-medium text-neutral-900">{slot.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button onClick={onNext} disabled={!pickupDate || !timeSlotId}>
          Continuer
        </Button>
      </div>
    </div>
  )
}
