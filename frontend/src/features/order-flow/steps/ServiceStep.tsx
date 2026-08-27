import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { IconCheck, IconShirt } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import { useServices } from '@/features/catalog/useCatalog'

interface ServiceStepProps {
  selectedServiceId: number | null
  onSelect: (id: number) => void
  onNext: () => void
}

export function ServiceStep({ selectedServiceId, onSelect, onNext }: ServiceStepProps) {
  const { data: services, isLoading, isError, refetch } = useServices()

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Choisissez votre service</h2>
      <p className="mt-1 text-sm text-neutral-500">Sélectionnez le traitement souhaité pour vos vêtements.</p>

      {isLoading && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {isError && (
        <div className="mt-6">
          <ErrorState onRetry={() => refetch()} />
        </div>
      )}

      {services && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {services.map((service) => {
            const selected = service.id === selectedServiceId
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => onSelect(service.id)}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-4 text-left transition-colors',
                  selected
                    ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                )}
                aria-pressed={selected}
              >
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                    selected ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-500'
                  )}
                >
                  <IconShirt width={18} height={18} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{service.name}</p>
                  <p className="mt-1 text-xs text-neutral-500 line-clamp-2">{service.description}</p>
                </div>
                {selected && <IconCheck width={18} height={18} className="text-primary-600" />}
              </button>
            )
          })}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button onClick={onNext} disabled={!selectedServiceId}>
          Continuer
        </Button>
      </div>
    </div>
  )
}
