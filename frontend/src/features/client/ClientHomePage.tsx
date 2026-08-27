import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge, orderStatusTone } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { IconClipboard, IconPlus } from '@/components/ui/icons'
import { useAuthStore } from '@/stores/authStore'
import { useOrders } from '@/features/orders/useOrders'

export function ClientHomePage() {
  const user = useAuthStore((s) => s.user)
  const { data: orders, isLoading, isError, refetch } = useOrders()
  const recentOrders = orders?.slice(0, 3) ?? []

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Bonjour {user?.first_name} 👋</h1>
          <p className="mt-1 text-sm text-neutral-500">Voici un aperçu de votre activité.</p>
        </div>
        <Link to="/commander">
          <Button leftIcon={<IconPlus width={16} height={16} />}>Nouvelle commande</Button>
        </Link>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">Commandes récentes</h2>
          <Link to="/client/commandes" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Voir tout
          </Link>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {isError && <ErrorState onRetry={() => refetch()} />}

        {orders && orders.length === 0 && (
          <EmptyState
            icon={<IconClipboard width={26} height={26} />}
            title="Aucune commande pour le moment"
            action={
              <Link to="/commander">
                <Button size="sm">Commander maintenant</Button>
              </Link>
            }
          />
        )}

        {recentOrders.length > 0 && (
          <div className="flex flex-col gap-3">
            {recentOrders.map((order) => (
              <Link key={order.id} to={`/client/commandes/${order.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardBody className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{order.order_number}</p>
                      <p className="text-xs text-neutral-500">{order.service?.name}</p>
                    </div>
                    <Badge tone={orderStatusTone(order.status)}>{order.status_label}</Badge>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
