import { Link } from 'react-router-dom'
import { Card, CardBody } from '@/components/ui/Card'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { IconClock, IconPackage, IconTruck } from '@/components/ui/icons'
import { useAuthStore } from '@/stores/authStore'
import { useLivreurDashboard } from './useLivreur'

export function LivreurDashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { data, isLoading, isError, refetch } = useLivreurDashboard()

  const stats = [
    { label: 'Collectes aujourd\'hui', value: data?.pickups_today, icon: <IconPackage />, to: '/livreur/missions?mission_type=pickup' },
    { label: 'Livraisons aujourd\'hui', value: data?.deliveries_today, icon: <IconTruck />, to: '/livreur/missions?mission_type=delivery' },
    { label: 'Missions en cours', value: data?.total_assigned, icon: <IconClock />, to: '/livreur/missions' },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold text-neutral-900">Bonjour {user?.first_name} 👋</h1>
      <p className="mt-1 text-sm text-neutral-500">Voici vos missions du jour.</p>

      {isLoading && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {isError && <div className="mt-6"><ErrorState onRetry={() => refetch()} /></div>}

      {data && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Link key={stat.label} to={stat.to}>
              <Card className="transition-shadow hover:shadow-md">
                <CardBody className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                    <p className="text-xs text-neutral-500">{stat.label}</p>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
