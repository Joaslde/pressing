import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, orderStatusTone, paymentStatusTone } from '@/components/ui/Badge'
import { Card, CardBody } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { IconClipboard, IconSearch } from '@/components/ui/icons'
import { useAdminOrders } from './useAdmin'

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'pending_payment', label: 'En attente de paiement' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'pickup_scheduled', label: 'Collecte planifiée' },
  { value: 'picked_up', label: 'Collectée' },
  { value: 'processing', label: 'En traitement' },
  { value: 'ready', label: 'Prête' },
  { value: 'delivery_scheduled', label: 'Livraison planifiée' },
  { value: 'out_for_delivery', label: 'En livraison' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'completed', label: 'Terminée' },
  { value: 'cancelled', label: 'Annulée' },
]

function formatFcfa(amount: number) {
  return `${amount.toLocaleString('fr-FR')} FCFA`
}

export function AdminOrdersPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const { data: orders, isLoading, isError, refetch } = useAdminOrders({
    search: search || undefined,
    status: status || undefined,
  })

  return (
    <div>
      <h1 className="text-xl font-bold text-neutral-900">Commandes</h1>
      <p className="mt-1 text-sm text-neutral-500">Consultez et gérez toutes les commandes.</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-1">
          <Input
            placeholder="Rechercher (numéro, client, téléphone)"
            leftIcon={<IconSearch width={16} height={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-56">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {isError && <ErrorState onRetry={() => refetch()} />}

        {orders && orders.length === 0 && (
          <EmptyState icon={<IconClipboard width={26} height={26} />} title="Aucune commande trouvée" />
        )}

        {orders && orders.length > 0 && (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <Link key={order.id} to={`/admin/commandes/${order.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardBody className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-neutral-900">{order.order_number}</p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {order.user?.full_name} - {order.user?.phone}
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
