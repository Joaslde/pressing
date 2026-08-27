import { Link, useParams } from 'react-router-dom'
import { Badge, orderStatusTone, paymentStatusTone } from '@/components/ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { IconChevronLeft } from '@/components/ui/icons'
import { useOrder } from '@/features/orders/useOrders'
import { OrderStatusTimeline } from '@/features/orders/OrderStatusTimeline'

function formatFcfa(amount: number) {
  return `${amount.toLocaleString('fr-FR')} FCFA`
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading, isError, refetch } = useOrder(id)

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} className="text-primary-600" />
      </div>
    )
  }

  if (isError || !order) {
    return <ErrorState onRetry={() => refetch()} />
  }

  return (
    <div>
      <Link to="/client/commandes" className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800">
        <IconChevronLeft width={16} height={16} /> Mes commandes
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{order.order_number}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Commandée le {new Date(order.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge tone={orderStatusTone(order.status)}>{order.status_label}</Badge>
          <Badge tone={paymentStatusTone(order.payment_status)}>{order.payment_status_label}</Badge>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Suivi</CardTitle></CardHeader>
          <CardBody>
            <OrderStatusTimeline status={order.status} statusLabel={order.status_label} />
          </CardBody>
        </Card>

        <div className="flex flex-col gap-5 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Articles</CardTitle></CardHeader>
            <CardBody>
              <ul className="flex flex-col gap-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span className="text-neutral-600">{item.article_name} × {item.quantity}</span>
                    <span className="font-medium text-neutral-900">{formatFcfa(item.subtotal)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-neutral-100 pt-3 text-sm font-semibold text-neutral-900">
                <span>Montant estimé</span>
                <span>{formatFcfa(order.estimated_amount)}</span>
              </div>
              {order.final_amount !== null && (
                <div className="mt-1 flex justify-between text-sm font-semibold text-primary-700">
                  <span>Montant final</span>
                  <span>{formatFcfa(order.final_amount)}</span>
                </div>
              )}
            </CardBody>
          </Card>

          <div className="grid gap-5 sm:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Collecte</CardTitle></CardHeader>
              <CardBody>
                <p className="text-sm text-neutral-800">{order.pickup_address?.full_address}</p>
                <p className="mt-2 text-sm text-neutral-500">
                  {order.pickup_date} - {order.time_slot?.label}
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader><CardTitle>Livraison</CardTitle></CardHeader>
              <CardBody>
                <p className="text-sm text-neutral-800">{order.delivery_address?.full_address}</p>
              </CardBody>
            </Card>
          </div>

          {order.notes && (
            <Card>
              <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
              <CardBody>
                <p className="text-sm text-neutral-600">{order.notes}</p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
