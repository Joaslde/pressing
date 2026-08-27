import { Link, useParams } from 'react-router-dom'
import { Badge, orderStatusTone } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/toastStore'
import { IconChevronLeft, IconClipboard } from '@/components/ui/icons'
import { getApiErrorMessage } from '@/lib/api'
import { useAdminClient, useToggleClientActive } from './useAdmin'

export function AdminClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, refetch } = useAdminClient(id)
  const toggleActive = useToggleClientActive()
  const toast = useToast()

  if (isLoading) {
    return <div className="flex justify-center py-16"><Spinner size={28} className="text-primary-600" /></div>
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} />
  }

  const { client, orders } = data

  const handleToggle = async () => {
    try {
      await toggleActive.mutateAsync(client.id)
      toast.success(client.is_active ? 'Compte désactivé' : 'Compte activé')
    } catch (error) {
      toast.error('Action impossible', getApiErrorMessage(error))
    }
  }

  return (
    <div>
      <Link to="/admin/clients" className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800">
        <IconChevronLeft width={16} height={16} /> Clients
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{client.full_name}</h1>
          <p className="mt-1 text-sm text-neutral-500">{client.phone} - {client.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={client.is_active ? 'success' : 'danger'}>{client.is_active ? 'Actif' : 'Désactivé'}</Badge>
          <Button variant="outline" size="sm" onClick={handleToggle} isLoading={toggleActive.isPending}>
            {client.is_active ? 'Désactiver' : 'Activer'}
          </Button>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Historique des commandes</CardTitle></CardHeader>
        <CardBody>
          {orders.data.length === 0 ? (
            <EmptyState icon={<IconClipboard width={24} height={24} />} title="Aucune commande" />
          ) : (
            <div className="flex flex-col gap-2">
              {orders.data.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b border-neutral-100 py-2 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{order.order_number}</p>
                    <p className="text-xs text-neutral-500">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <Badge tone={orderStatusTone(order.status)}>{order.status_label}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
