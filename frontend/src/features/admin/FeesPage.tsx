import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/toastStore'
import { IconEdit, IconPlus, IconTag } from '@/components/ui/icons'
import { getApiErrorMessage } from '@/lib/api'
import { feesAdmin } from './useAdminCatalog'
import type { Fee } from '@/types'

const emptyForm = { type: 'pickup', label: '', amount: '' }

function formatFcfa(amount: number) {
  return `${amount.toLocaleString('fr-FR')} FCFA`
}

export function AdminFeesPage() {
  const { data: fees, isLoading, isError, refetch } = feesAdmin.useList()
  const createFee = feesAdmin.useCreate()
  const updateFee = feesAdmin.useUpdate()
  const toast = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (fee: Fee) => {
    setEditingId(fee.id)
    setForm({ type: fee.type, label: fee.label, amount: String(fee.amount) })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = { type: form.type as Fee['type'], label: form.label, amount: Number(form.amount) }
      if (editingId) {
        await updateFee.mutateAsync({ id: editingId, ...payload })
        toast.success('Frais mis à jour')
      } else {
        await createFee.mutateAsync(payload)
        toast.success('Frais créé')
      }
      setModalOpen(false)
    } catch (error) {
      toast.error('Une erreur est survenue', getApiErrorMessage(error))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Frais</h1>
          <p className="mt-1 text-sm text-neutral-500">Frais de collecte, de livraison et autres.</p>
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
        {fees && fees.length === 0 && <EmptyState icon={<IconTag width={26} height={26} />} title="Aucun frais configuré" />}

        {fees && fees.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {fees.map((fee) => (
              <Card key={fee.id}>
                <CardBody className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">{fee.label}</p>
                    <p className="text-xs text-neutral-500">{formatFcfa(fee.amount)}</p>
                    <Badge tone={fee.is_active ? 'success' : 'neutral'} className="mt-1.5">
                      {fee.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <button onClick={() => openEdit(fee)} aria-label={`Modifier ${fee.label}`} className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
                    <IconEdit width={15} height={15} />
                  </button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Modifier le frais' : 'Nouveau frais'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Select label="Type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
            <option value="pickup">Collecte</option>
            <option value="delivery">Livraison</option>
            <option value="other">Autre</option>
          </Select>
          <Input label="Libellé" required value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} />
          <Input label="Montant (FCFA)" type="number" min={0} required value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button type="submit" isLoading={createFee.isPending || updateFee.isPending}>Enregistrer</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
