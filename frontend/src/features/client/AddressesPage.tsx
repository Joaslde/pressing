import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardBody } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/toastStore'
import { IconEdit, IconMapPin, IconPlus, IconTrash } from '@/components/ui/icons'
import { getApiErrorMessage } from '@/lib/api'
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useUpdateAddress,
} from '@/features/addresses/useAddresses'
import type { Address } from '@/types'

const emptyForm = { label: '', full_address: '', city: '', district: '', instructions: '' }

export function AddressesPage() {
  const { data: addresses, isLoading, isError, refetch } = useAddresses()
  const createAddress = useCreateAddress()
  const updateAddress = useUpdateAddress()
  const deleteAddress = useDeleteAddress()
  const toast = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null)

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (address: Address) => {
    setEditingId(address.id)
    setForm({
      label: address.label,
      full_address: address.full_address,
      city: address.city ?? '',
      district: address.district ?? '',
      instructions: address.instructions ?? '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateAddress.mutateAsync({ id: editingId, ...form })
        toast.success('Adresse mise à jour')
      } else {
        await createAddress.mutateAsync(form)
        toast.success('Adresse ajoutée')
      }
      setModalOpen(false)
    } catch (error) {
      toast.error("Une erreur est survenue", getApiErrorMessage(error))
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteAddress.mutateAsync(deleteTarget.id)
      toast.success('Adresse supprimée')
      setDeleteTarget(null)
    } catch (error) {
      toast.error('Suppression impossible', getApiErrorMessage(error))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Mes adresses</h1>
          <p className="mt-1 text-sm text-neutral-500">Gérez vos adresses de collecte et de livraison.</p>
        </div>
        <Button size="sm" leftIcon={<IconPlus width={16} height={16} />} onClick={openCreate}>
          Ajouter
        </Button>
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {isError && <ErrorState onRetry={() => refetch()} />}

        {addresses && addresses.length === 0 && (
          <EmptyState
            icon={<IconMapPin width={28} height={28} />}
            title="Aucune adresse enregistrée"
            description="Ajoutez une adresse pour passer commande plus rapidement."
            action={<Button size="sm" onClick={openCreate}>Ajouter une adresse</Button>}
          />
        )}

        {addresses && addresses.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {addresses.map((address) => (
              <Card key={address.id}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <IconMapPin width={16} height={16} className="mt-0.5 shrink-0 text-neutral-400" />
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          {address.label} {address.is_default && <Badge tone="primary" className="ml-1">Par défaut</Badge>}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">{address.full_address}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => openEdit(address)}
                        aria-label={`Modifier ${address.label}`}
                        className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                      >
                        <IconEdit width={15} height={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(address)}
                        aria-label={`Supprimer ${address.label}`}
                        className="rounded-md p-1.5 text-neutral-400 hover:bg-red-50 hover:text-danger"
                      >
                        <IconTrash width={15} height={15} />
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Modifier l'adresse" : 'Nouvelle adresse'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input label="Libellé" required value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} />
          <Input label="Adresse complète" required value={form.full_address} onChange={(e) => setForm((f) => ({ ...f, full_address: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Ville" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
            <Input label="Quartier" value={form.district} onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))} />
          </div>
          <Input
            label="Instructions (optionnel)"
            value={form.instructions}
            onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" isLoading={createAddress.isPending || updateAddress.isPending}>
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Supprimer l'adresse" size="sm">
        <p className="text-sm text-neutral-600">
          Êtes-vous sûr de vouloir supprimer l'adresse « {deleteTarget?.label} » ? Cette action est irréversible.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={deleteAddress.isPending}>
            Supprimer
          </Button>
        </div>
      </Modal>
    </div>
  )
}
