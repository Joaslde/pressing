import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { useToast } from '@/components/ui/toastStore'
import { IconCheck, IconLocation, IconMapPin, IconPlus } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import { useGeolocation } from '@/lib/useGeolocation'
import { getApiErrorMessage } from '@/lib/api'
import { useAddresses, useCreateAddress, useReverseGeocode } from '@/features/addresses/useAddresses'
import type { Address } from '@/types'

interface AddressStepProps {
  title: string
  description: string
  selectedAddressId: number | null
  onSelect: (id: number) => void
  onBack: () => void
  onNext: () => void
  extraAction?: React.ReactNode
}

export function AddressStep({
  title,
  description,
  selectedAddressId,
  onSelect,
  onBack,
  onNext,
  extraAction,
}: AddressStepProps) {
  const { data: addresses, isLoading, isError, refetch } = useAddresses()
  const createAddress = useCreateAddress()
  const geolocation = useGeolocation()
  const reverseGeocode = useReverseGeocode()
  const toast = useToast()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    label: 'Domicile',
    full_address: '',
    city: '',
    district: '',
    instructions: '',
  })
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null)

  const handleUseLocation = () => {
    setShowForm(true)
    geolocation.request()
  }

  // React to a successful geolocation fix by reverse-geocoding it.
  if (geolocation.status === 'success' && geolocation.coords && !coords) {
    setCoords(geolocation.coords)
    reverseGeocode.mutate(geolocation.coords, {
      onSuccess: (data) => {
        setForm((f) => ({
          ...f,
          full_address: data.full_address || f.full_address,
          city: data.city || f.city,
          district: data.district || f.district,
        }))
      },
      onError: () => {
        toast.error("Géolocalisation", "Impossible de déterminer votre adresse automatiquement. Complétez-la manuellement.")
      },
    })
  }

  const handleCreate = async () => {
    if (!form.full_address.trim()) {
      toast.error('Adresse requise', "Merci de renseigner l'adresse complète.")
      return
    }
    try {
      const address = await createAddress.mutateAsync({
        label: form.label || 'Adresse',
        full_address: form.full_address,
        city: form.city || null,
        district: form.district || null,
        instructions: form.instructions || null,
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
        is_default: false,
      })
      onSelect(address.id)
      setShowForm(false)
      setForm({ label: 'Domicile', full_address: '', city: '', district: '', instructions: '' })
      setCoords(null)
      toast.success('Adresse ajoutée')
    } catch (error) {
      toast.error('Impossible d\'ajouter cette adresse', getApiErrorMessage(error))
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
      <p className="mt-1 text-sm text-neutral-500">{description}</p>
      {extraAction}

      {isLoading && <div className="mt-6 flex justify-center py-8"><Spinner className="text-primary-600" /></div>}
      {isError && <div className="mt-6"><ErrorState onRetry={() => refetch()} /></div>}

      {addresses && (
        <div className="mt-6 flex flex-col gap-2">
          {addresses.map((address: Address) => {
            const selected = address.id === selectedAddressId
            return (
              <button
                key={address.id}
                type="button"
                onClick={() => onSelect(address.id)}
                aria-pressed={selected}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-4 text-left transition-colors',
                  selected
                    ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                )}
              >
                <IconMapPin
                  width={18}
                  height={18}
                  className={cn('mt-0.5 shrink-0', selected ? 'text-primary-600' : 'text-neutral-400')}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">{address.label}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">{address.full_address}</p>
                </div>
                {selected && <IconCheck width={18} height={18} className="text-primary-600" />}
              </button>
            )
          })}
        </div>
      )}

      {!showForm && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" leftIcon={<IconPlus width={16} height={16} />} onClick={() => setShowForm(true)}>
            Saisir une nouvelle adresse
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<IconLocation width={16} height={16} />}
            onClick={handleUseLocation}
          >
            Utiliser ma position actuelle
          </Button>
        </div>
      )}

      {showForm && (
        <div className="mt-4 rounded-xl border border-neutral-200 p-4">
          {geolocation.status === 'requesting' && (
            <p className="mb-3 flex items-center gap-2 text-xs text-neutral-500">
              <Spinner size={14} /> Localisation en cours…
            </p>
          )}
          {geolocation.error && <p className="mb-3 text-xs text-warning">{geolocation.error}</p>}
          {reverseGeocode.isPending && (
            <p className="mb-3 flex items-center gap-2 text-xs text-neutral-500">
              <Spinner size={14} /> Recherche de l'adresse correspondante…
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Libellé"
              placeholder="Domicile, Bureau…"
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            />
            <Input
              label="Ville"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
          </div>
          <div className="mt-3">
            <Input
              label="Adresse complète"
              required
              value={form.full_address}
              onChange={(e) => setForm((f) => ({ ...f, full_address: e.target.value }))}
            />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Input
              label="Quartier"
              value={form.district}
              onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))}
            />
            <Input
              label="Instructions (optionnel)"
              placeholder="Portail bleu, 2e étage…"
              value={form.instructions}
              onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
            <Button type="button" size="sm" onClick={handleCreate} isLoading={createAddress.isPending}>
              Enregistrer cette adresse
            </Button>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button onClick={onNext} disabled={!selectedAddressId}>
          Continuer
        </Button>
      </div>
    </div>
  )
}
