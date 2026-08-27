import { Link } from 'react-router-dom'
import { Badge, orderStatusTone, paymentStatusTone } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { IconClipboard, IconPlus } from '@/components/ui/icons'
import { useOrders } from '@/features/orders/useOrders'

function formatFcfa(amount: number) {
  return `${amount.toLocaleString('fr-FR')} FCFA`
}

export function OrdersListPage() {
  const { data: orders, isLoading, isError, refetch } = useOrders()

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Mes commandes</h1>
          <p className="mt-1 text-sm text-neutral-500">Suivez l'état de vos commandes en cours et passées.</p>
        </div>
        <Link to="/commander">
          <Button size="sm" leftIcon={<IconPlus width={16} height={16} />}>
            Nouvelle commande
          </Button>
        </Link>
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {isError && <ErrorState onRetry={() => refetch()} />}

        {orders && orders.length === 0 && (
          <EmptyState
            icon={<IconClipboard width={28} height={28} />}
            title="Aucune commande pour le moment"
            description="Passez votre première commande en quelques clics."
            action={
              <Link to="/commander">
                <Button size="sm">Commander maintenant</Button>
              </Link>
            }
          />
        )}

        {orders && orders.length > 0 && (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <Link key={order.id} to={`/client/commandes/${order.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardBody className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-neutral-900">{order.order_number}</p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')} - {order.service?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={orderStatusTone(order.status)}>{order.status_label}</Badge>
                      <Badge tone={paymentStatusTone(order.payment_status)}>{order.payment_status_label}</Badge>
                    </div>
                    <p className="font-semibold text-neutral-900">{formatFcfa(order.estimated_amount)}</p>
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
