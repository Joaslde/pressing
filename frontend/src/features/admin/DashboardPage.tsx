import { Card, CardBody } from '@/components/ui/Card'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { IconClipboard, IconCreditCard, IconPackage, IconTruck, IconUsers } from '@/components/ui/icons'
import { useAdminDashboard } from './useAdmin'

function formatFcfa(amount: number) {
  return `${amount.toLocaleString('fr-FR')} FCFA`
}

export function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useAdminDashboard()

  const kpis = data
    ? [
        { label: 'Commandes du jour', value: data.today.orders_count, icon: <IconClipboard /> },
        { label: 'En attente', value: data.today.orders_pending, icon: <IconClipboard /> },
        { label: 'Collectes prévues', value: data.today.pickups_scheduled, icon: <IconPackage /> },
        { label: 'Livraisons prévues', value: data.today.deliveries_scheduled, icon: <IconTruck /> },
        { label: 'Paiements reçus', value: formatFcfa(data.today.payments_received), icon: <IconCreditCard /> },
        { label: "Chiffre d'affaires du jour", value: formatFcfa(data.today.revenue), icon: <IconCreditCard /> },
      ]
    : []

  return (
    <div>
      <h1 className="text-xl font-bold text-neutral-900">Tableau de bord</h1>
      <p className="mt-1 text-sm text-neutral-500">Indicateurs du jour et statistiques générales.</p>

      {isLoading && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {isError && <div className="mt-6"><ErrorState onRetry={() => refetch()} /></div>}

      {data && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {kpis.map((kpi) => (
              <Card key={kpi.label}>
                <CardBody className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    {kpi.icon}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-neutral-900">{kpi.value}</p>
                    <p className="text-xs text-neutral-500">{kpi.label}</p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardBody>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-900">
                  <IconClipboard width={16} height={16} /> Services les plus commandés
                </h2>
                {data.top_services.length === 0 ? (
                  <p className="text-sm text-neutral-500">Aucune donnée pour le moment.</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {data.top_services.map((service) => (
                      <li key={service.name} className="flex justify-between text-sm">
                        <span className="text-neutral-600">{service.name}</span>
                        <span className="font-medium text-neutral-900">{service.total}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardBody>
            </Card>
            <Card>
              <CardBody className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <IconUsers />
                </div>
                <div>
                  <p className="text-xl font-bold text-neutral-900">{data.active_clients}</p>
                  <p className="text-xs text-neutral-500">Clients actifs</p>
                </div>
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
