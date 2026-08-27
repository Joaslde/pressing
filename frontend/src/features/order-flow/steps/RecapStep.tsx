import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { useArticles, useFees, useServices } from '@/features/catalog/useCatalog'
import { useAddresses } from '@/features/addresses/useAddresses'
import { useTimeSlots } from '@/features/catalog/useCatalog'
import type { OrderFlowState } from '../types'

interface RecapStepProps {
  state: OrderFlowState
  onNotesChange: (notes: string) => void
  onBack: () => void
  onConfirm: () => void
  isSubmitting: boolean
}

function formatFcfa(amount: number) {
  return `${amount.toLocaleString('fr-FR')} FCFA`
}

export function RecapStep({ state, onNotesChange, onBack, onConfirm, isSubmitting }: RecapStepProps) {
  const { data: services } = useServices()
  const { data: articles } = useArticles()
  const { data: addresses } = useAddresses()
  const { data: slots } = useTimeSlots(state.pickupDate ?? undefined)
  const { data: fees } = useFees()

  const service = services?.find((s) => s.id === state.serviceId)
  const pickupAddress = addresses?.find((a) => a.id === state.pickupAddressId)
  const deliveryAddress = addresses?.find((a) => a.id === state.deliveryAddressId)
  const slot = slots?.find((s) => s.id === state.timeSlotId)

  const lines = Object.entries(state.items)
    .filter(([, qty]) => qty > 0)
    .map(([articleId, qty]) => {
      const article = articles?.find((a) => a.id === Number(articleId))
      return article ? { article, qty, subtotal: article.price * qty } : null
    })
    .filter((line): line is NonNullable<typeof line> => line !== null)

  const itemsSubtotal = lines.reduce((sum, line) => sum + line.subtotal, 0)
  const pickupFee = fees?.find((f) => f.type === 'pickup')
  const deliveryFee = fees?.find((f) => f.type === 'delivery')
  const grandTotal = itemsSubtotal + (pickupFee?.amount ?? 0) + (deliveryFee?.amount ?? 0)

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Récapitulatif</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Vérifiez les informations avant de passer au paiement. Le montant final sera confirmé après validation.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <div className="rounded-xl border border-neutral-200 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Service</p>
          <p className="mt-1 text-sm font-medium text-neutral-900">{service?.name}</p>
        </div>

        <div className="rounded-xl border border-neutral-200 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Articles</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {lines.map((line) => (
              <li key={line.article.id} className="flex justify-between text-sm">
                <span className="text-neutral-600">
                  {line.article.name} × {line.qty}
                </span>
                <span className="font-medium text-neutral-900">{formatFcfa(line.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-neutral-600">Sous-total articles</span>
            <span className="font-medium text-neutral-900">{formatFcfa(itemsSubtotal)}</span>
          </div>
          {pickupFee && (
            <div className="mt-1.5 flex justify-between text-sm">
              <span className="text-neutral-600">{pickupFee.label}</span>
              <span className="font-medium text-neutral-900">{formatFcfa(pickupFee.amount)}</span>
            </div>
          )}
          {deliveryFee && (
            <div className="mt-1.5 flex justify-between text-sm">
              <span className="text-neutral-600">{deliveryFee.label}</span>
              <span className="font-medium text-neutral-900">{formatFcfa(deliveryFee.amount)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between border-t border-neutral-100 pt-2 text-sm font-semibold text-neutral-900">
            <span>Total</span>
            <span>{formatFcfa(grandTotal)}</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Adresse de collecte</p>
            <p className="mt-1 text-sm text-neutral-800">{pickupAddress?.full_address}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Adresse de livraison</p>
            <p className="mt-1 text-sm text-neutral-800">{deliveryAddress?.full_address}</p>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Collecte</p>
          <p className="mt-1 text-sm text-neutral-800">
            {state.pickupDate} - {slot?.label}
          </p>
        </div>

        <Textarea
          label="Notes (optionnel)"
          placeholder="Précisions pour le livreur ou le pressing…"
          value={state.notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          Retour
        </Button>
        <Button onClick={onConfirm} isLoading={isSubmitting}>
          Confirmer et payer
        </Button>
      </div>
    </div>
  )
}
