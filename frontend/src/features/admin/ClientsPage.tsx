import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { IconSearch, IconUsers } from '@/components/ui/icons'
import { useAdminClients } from './useAdmin'

export function AdminClientsPage() {
  const [search, setSearch] = useState('')
  const { data: clients, isLoading, isError, refetch } = useAdminClients(search || undefined)

  return (
    <div>
      <h1 className="text-xl font-bold text-neutral-900">Clients</h1>
      <p className="mt-1 text-sm text-neutral-500">Consultez et gérez les comptes clients.</p>

      <div className="mt-4 max-w-sm">
        <Input
          placeholder="Rechercher un client…"
          leftIcon={<IconSearch width={16} height={16} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {isError && <ErrorState onRetry={() => refetch()} />}

        {clients && clients.length === 0 && (
          <EmptyState icon={<IconUsers width={26} height={26} />} title="Aucun client trouvé" />
        )}

        {clients && clients.length > 0 && (
          <div className="flex flex-col gap-3">
            {clients.map((client) => (
              <Link key={client.id} to={`/admin/clients/${client.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardBody className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-neutral-900">{client.full_name}</p>
                      <p className="text-xs text-neutral-500">{client.phone} - {client.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-500">{client.orders_count} commande(s)</span>
                      <Badge tone={client.is_active ? 'success' : 'danger'}>
                        {client.is_active ? 'Actif' : 'Désactivé'}
                      </Badge>
                    </div>
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
