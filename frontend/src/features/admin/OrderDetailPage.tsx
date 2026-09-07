import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge, orderStatusTone, paymentStatusTone } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/toastStore'
import { IconChevronLeft } from '@/components/ui/icons'
import { getApiErrorMessage } from '@/lib/api'
import { useAdminLivreurs, useAdminOrder, useAssignLivreur, useUpdateOrderStatus } from './useAdmin'
import type { OrderStatus } from '@/types'

const nextStatusOptions: Partial<Record<OrderStatus, OrderStatus[]>> = {
  draft: ['pending_payment', 'cancelled'],
  pending_payment: ['confirmed', 'cancelled'],
  confirmed: ['pickup_scheduled', 'cancelled'],
  pickup_scheduled: ['picked_up', 'cancelled'],
  picked_up: ['processing', 'cancelled'],
  processing: ['ready', 'cancelled'],
  ready: ['awaiting_balance', 'delivery_scheduled', 'cancelled'],
  awaiting_balance: ['delivery_scheduled', 'cancelled'],
  delivery_scheduled: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered', 'cancelled'],
  delivered: ['completed'],
}

const statusLabels: Record<OrderStatus, string> = {
  draft: 'Brouillon',
  pending_payment: 'En attente de paiement',
  confirmed: 'Confirmée',
  pickup_scheduled: 'Collecte planifiée',
  picked_up: 'Collectée',
  processing: 'En traitement',
  ready: 'Prête',
  awaiting_balance: 'En attente du solde',
  delivery_scheduled: 'Livraison planifiée',
  out_for_delivery: 'En livraison',
  delivered: 'Livrée',
  completed: 'Terminée',
  cancelled: 'Annulée',
}

function formatFcfa(amount: number) {
  return `${amount.toLocaleString('fr-FR')} FCFA`
}

// Mirrors the backend's OrderStatusService rules for these two transitions
// (confirmed -> pickup_scheduled, {ready, awaiting_balance} -> delivery_scheduled)
// so the UI can explain upfront why "Affecter" is unavailable, instead of
// letting the admin click it and only then finding out from an error toast.
const assignmentRequirements: Record<'pickup' | 'delivery', OrderStatus[]> = {
  pickup: ['confirmed'],
  delivery: ['ready', 'awaiting_balance'],
}

function assignmentBlockedReason(missionType: 'pickup' | 'delivery', currentStatus: OrderStatus): string | null {
  const requiredStatuses = assignmentRequirements[missionType]
  if (requiredStatuses.includes(currentStatus)) return null

  const requiredLabels = requiredStatuses.map((status) => `« ${statusLabels[status]} »`).join(' ou ')
  return `Affectation possible uniquement quand la commande est ${requiredLabels}. Elle est actuellement « ${statusLabels[currentStatus]} ».`
}

export function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading, isError, refetch } = useAdminOrder(id)
  const { data: livreurs } = useAdminLivreurs()
  const updateStatus = useUpdateOrderStatus()
  const assignLivreur = useAssignLivreur()
  const toast = useToast()

  const [selectedLivreur, setSelectedLivreur] = useState<Record<'pickup' | 'delivery', string>>({
    pickup: '',
    delivery: '',
  })

  if (isLoading) {
    return <div className="flex justify-center py-16"><Spinner size={28} className="text-primary-600" /></div>
  }

  if (isError || !order) {
    return <ErrorState onRetry={() => refetch()} />
  }

  const handleStatusChange = async (status: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ id: order.id, status })
      toast.success('Statut mis à jour')
    } catch (error) {
      toast.error('Mise à jour impossible', getApiErrorMessage(error))
    }
  }

  const handleAssign = async (missionType: 'pickup' | 'delivery') => {
    const livreurId = selectedLivreur[missionType]
    if (!livreurId) return
    try {
      await assignLivreur.mutateAsync({
        orderId: order.id,
        deliveryPersonId: Number(livreurId),
        missionType,
      })
      toast.success(missionType === 'pickup' ? 'Livreur affecté à la collecte' : 'Livreur affecté à la livraison')
    } catch (error) {
      toast.error("Affectation impossible", getApiErrorMessage(error))
    }
  }

  const availableTransitions = nextStatusOptions[order.status] ?? []
  const pickupBlockedReason = assignmentBlockedReason('pickup', order.status)
  const deliveryBlockedReason = assignmentBlockedReason('delivery', order.status)

  return (
    <div>
      <Link to="/admin/commandes" className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800">
        <IconChevronLeft width={16} height={16} /> Commandes
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{order.order_number}</h1>
          <p className="mt-1 text-sm text-neutral-500">{order.user?.full_name} - {order.user?.phone}</p>
        </div>
        <div className="flex gap-2">
          <Badge tone={orderStatusTone(order.status)}>{order.status_label}</Badge>
          <Badge tone={paymentStatusTone(order.payment_status)}>{order.payment_status_label}</Badge>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
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
            </CardBody>
          </Card>

          <div className="grid gap-5 sm:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Collecte</CardTitle></CardHeader>
              <CardBody>
                <p className="text-sm text-neutral-800">{order.pickup_address?.full_address}</p>
                <p className="mt-2 text-sm text-neutral-500">{order.pickup_date} - {order.time_slot?.label}</p>
                <div className="mt-3 flex gap-2" title={pickupBlockedReason ?? undefined}>
                  <Select
                    value={selectedLivreur.pickup}
                    onChange={(e) => setSelectedLivreur((s) => ({ ...s, pickup: e.target.value }))}
                    disabled={!!pickupBlockedReason}
                  >
                    <option value="">Choisir un livreur</option>
                    {livreurs?.filter((l) => l.is_active).map((l) => (
                      <option key={l.id} value={l.id}>{l.full_name}</option>
                    ))}
                  </Select>
                  <Button
                    size="sm"
                    onClick={() => handleAssign('pickup')}
                    isLoading={assignLivreur.isPending}
                    disabled={!!pickupBlockedReason || !selectedLivreur.pickup}
                  >
                    Affecter
                  </Button>
                </div>
                {pickupBlockedReason && <p className="mt-1.5 text-xs text-neutral-400">{pickupBlockedReason}</p>}
              </CardBody>
            </Card>
            <Card>
              <CardHeader><CardTitle>Livraison</CardTitle></CardHeader>
              <CardBody>
                <p className="text-sm text-neutral-800">{order.delivery_address?.full_address}</p>
                <div className="mt-3 flex gap-2" title={deliveryBlockedReason ?? undefined}>
                  <Select
                    value={selectedLivreur.delivery}
                    onChange={(e) => setSelectedLivreur((s) => ({ ...s, delivery: e.target.value }))}
                    disabled={!!deliveryBlockedReason}
                  >
                    <option value="">Choisir un livreur</option>
                    {livreurs?.filter((l) => l.is_active).map((l) => (
                      <option key={l.id} value={l.id}>{l.full_name}</option>
                    ))}
                  </Select>
                  <Button
                    size="sm"
                    onClick={() => handleAssign('delivery')}
                    isLoading={assignLivreur.isPending}
                    disabled={!!deliveryBlockedReason || !selectedLivreur.delivery}
                  >
                    Affecter
                  </Button>
                </div>
                {deliveryBlockedReason && <p className="mt-1.5 text-xs text-neutral-400">{deliveryBlockedReason}</p>}
              </CardBody>
            </Card>
          </div>
        </div>

        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Changer le statut</CardTitle></CardHeader>
          <CardBody>
            {availableTransitions.length === 0 ? (
              <p className="text-sm text-neutral-500">Aucune transition disponible depuis ce statut.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {availableTransitions.map((status) => (
                  <Button
                    key={status}
                    variant={status === 'cancelled' ? 'outline' : 'primary'}
                    size="sm"
                    className={status === 'cancelled' ? 'border-danger text-danger hover:bg-red-50' : ''}
                    onClick={() => handleStatusChange(status)}
                    isLoading={updateStatus.isPending}
                  >
                    {statusLabels[status]}
                  </Button>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
