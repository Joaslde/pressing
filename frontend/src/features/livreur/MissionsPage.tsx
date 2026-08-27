import { useSearchParams } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/toastStore'
import { IconMapPin, IconPackage, IconTruck } from '@/components/ui/icons'
import { getApiErrorMessage } from '@/lib/api'
import { useConfirmMission, useMissions } from './useLivreur'

export function MissionsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const missionType = searchParams.get('mission_type') as 'pickup' | 'delivery' | null
  const { data: missions, isLoading, isError, refetch } = useMissions({
    mission_type: missionType ?? undefined,
    status: 'assigned',
  })
  const confirmMission = useConfirmMission()
  const toast = useToast()

  const handleConfirm = async (id: number, type: 'pickup' | 'delivery') => {
    try {
      await confirmMission.mutateAsync(id)
      toast.success(type === 'pickup' ? 'Collecte confirmée' : 'Livraison confirmée')
    } catch (error) {
      toast.error('Confirmation impossible', getApiErrorMessage(error))
    }
  }

  const filters: Array<{ value: 'pickup' | 'delivery' | null; label: string }> = [
    { value: null, label: 'Toutes' },
    { value: 'pickup', label: 'Collectes' },
    { value: 'delivery', label: 'Livraisons' },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold text-neutral-900">Mes missions</h1>
      <p className="mt-1 text-sm text-neutral-500">Collectes et livraisons qui vous sont affectées.</p>

      <div className="mt-4 flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.label}
            onClick={() =>
              setSearchParams(filter.value ? { mission_type: filter.value } : {})
            }
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              missionType === filter.value
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {isError && <ErrorState onRetry={() => refetch()} />}

        {missions && missions.length === 0 && (
          <EmptyState icon={<IconPackage width={26} height={26} />} title="Aucune mission en attente" />
        )}

        {missions && missions.length > 0 && (
          <div className="flex flex-col gap-3">
            {missions.map((mission) => (
              <Card key={mission.id}>
                <CardBody>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                        {mission.mission_type === 'pickup' ? (
                          <IconPackage width={18} height={18} />
                        ) : (
                          <IconTruck width={18} height={18} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-neutral-900">{mission.order.order_number}</p>
                          <Badge tone="primary">{mission.mission_type_label}</Badge>
                        </div>
                        <p className="mt-1 flex items-center gap-1 text-sm text-neutral-600">
                          <IconMapPin width={14} height={14} /> {mission.order.address.full_address}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {mission.order.client.full_name} - {mission.order.client.phone}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {mission.order.pickup_date} - {mission.order.time_slot.label}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleConfirm(mission.id, mission.mission_type)}
                      isLoading={confirmMission.isPending}
                    >
                      Confirmer {mission.mission_type === 'pickup' ? 'la collecte' : 'la livraison'}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
