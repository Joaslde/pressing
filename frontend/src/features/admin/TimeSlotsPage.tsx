import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/toastStore'
import { IconClock, IconEdit, IconPlus } from '@/components/ui/icons'
import { getApiErrorMessage } from '@/lib/api'
import { timeSlotsAdmin } from './useAdminCatalog'
import type { TimeSlot } from '@/types'

const emptyForm = { label: '', start_time: '', end_time: '', max_capacity: '' }

export function AdminTimeSlotsPage() {
  const { data: slots, isLoading, isError, refetch } = timeSlotsAdmin.useList()
  const createSlot = timeSlotsAdmin.useCreate()
  const updateSlot = timeSlotsAdmin.useUpdate()
  const toast = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (slot: TimeSlot) => {
    setEditingId(slot.id)
    setForm({
      label: slot.label,
      start_time: slot.start_time,
      end_time: slot.end_time,
      max_capacity: slot.max_capacity ? String(slot.max_capacity) : '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        label: form.label,
        start_time: form.start_time,
        end_time: form.end_time,
        max_capacity: form.max_capacity ? Number(form.max_capacity) : null,
      }
      if (editingId) {
        await updateSlot.mutateAsync({ id: editingId, ...payload })
        toast.success('Créneau mis à jour')
      } else {
        await createSlot.mutateAsync(payload)
        toast.success('Créneau créé')
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
          <h1 className="text-xl font-bold text-neutral-900">Créneaux de collecte</h1>
          <p className="mt-1 text-sm text-neutral-500">Définissez les créneaux proposés aux clients.</p>
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
        {slots && slots.length === 0 && <EmptyState icon={<IconClock width={26} height={26} />} title="Aucun créneau configuré" />}

        {slots && slots.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {slots.map((slot) => (
              <Card key={slot.id}>
                <CardBody className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">{slot.label}</p>
                    <p className="text-xs text-neutral-500">
                      Capacité : {slot.max_capacity ?? 'illimitée'}
                    </p>
                    <Badge tone={slot.is_active ? 'success' : 'neutral'} className="mt-1.5">
                      {slot.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <button onClick={() => openEdit(slot)} aria-label={`Modifier ${slot.label}`} className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
                    <IconEdit width={15} height={15} />
                  </button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Modifier le créneau' : 'Nouveau créneau'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input label="Libellé" required placeholder="08h - 10h" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Heure de début" type="time" required value={form.start_time} onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))} />
            <Input label="Heure de fin" type="time" required value={form.end_time} onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))} />
          </div>
          <Input
            label="Capacité maximale (optionnel)"
            type="number"
            min={1}
            hint="Laisser vide pour une capacité illimitée"
            value={form.max_capacity}
            onChange={(e) => setForm((f) => ({ ...f, max_capacity: e.target.value }))}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button type="submit" isLoading={createSlot.isPending || updateSlot.isPending}>Enregistrer</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
