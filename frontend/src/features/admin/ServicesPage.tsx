import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/toastStore'
import { IconEdit, IconPlus, IconShirt, IconTrash } from '@/components/ui/icons'
import { getApiErrorMessage } from '@/lib/api'
import { servicesAdmin } from './useAdminCatalog'
import type { Service } from '@/types'

const emptyForm = { name: '', description: '', treatment_type: '' }

export function AdminServicesPage() {
  const { data: services, isLoading, isError, refetch } = servicesAdmin.useList()
  const createService = servicesAdmin.useCreate()
  const updateService = servicesAdmin.useUpdate()
  const removeService = servicesAdmin.useRemove()
  const toast = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (service: Service) => {
    setEditingId(service.id)
    setForm({ name: service.name, description: service.description ?? '', treatment_type: service.treatment_type })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateService.mutateAsync({ id: editingId, ...form })
        toast.success('Service mis à jour')
      } else {
        await createService.mutateAsync(form)
        toast.success('Service créé')
      }
      setModalOpen(false)
    } catch (error) {
      toast.error('Une erreur est survenue', getApiErrorMessage(error))
    }
  }

  const handleDeactivate = async (id: number) => {
    try {
      await removeService.mutateAsync(id)
      toast.success('Service désactivé')
    } catch (error) {
      toast.error('Action impossible', getApiErrorMessage(error))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Services</h1>
          <p className="mt-1 text-sm text-neutral-500">Gérez les services proposés aux clients.</p>
        </div>
        <Button size="sm" leftIcon={<IconPlus width={16} height={16} />} onClick={openCreate}>
          Ajouter
        </Button>
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}
        {isError && <ErrorState onRetry={() => refetch()} />}
        {services && services.length === 0 && (
          <EmptyState icon={<IconShirt width={26} height={26} />} title="Aucun service" />
        )}

        {services && services.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <Card key={service.id}>
                <CardBody>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-neutral-900">{service.name}</p>
                        <Badge tone={service.is_active ? 'success' : 'neutral'}>
                          {service.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500 line-clamp-2">{service.description}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button onClick={() => openEdit(service)} aria-label={`Modifier ${service.name}`} className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
                        <IconEdit width={15} height={15} />
                      </button>
                      {service.is_active && (
                        <button onClick={() => handleDeactivate(service.id)} aria-label={`Désactiver ${service.name}`} className="rounded-md p-1.5 text-neutral-400 hover:bg-red-50 hover:text-danger">
                          <IconTrash width={15} height={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Modifier le service' : 'Nouveau service'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input label="Nom" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input
            label="Type de traitement"
            required
            hint="Identifiant technique, ex : hand_wash, wash_and_iron, iron_only, dry_clean"
            value={form.treatment_type}
            onChange={(e) => setForm((f) => ({ ...f, treatment_type: e.target.value }))}
          />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button type="submit" isLoading={createService.isPending || updateService.isPending}>Enregistrer</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
