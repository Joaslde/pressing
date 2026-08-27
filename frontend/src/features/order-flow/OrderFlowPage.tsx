import { useState } from 'react'
import { useToast } from '@/components/ui/toastStore'
import { getApiErrorMessage } from '@/lib/api'
import { useCreateOrder } from '@/features/orders/useOrders'
import type { Order } from '@/types'
import { StepIndicator } from './StepIndicator'
import { initialOrderFlowState } from './types'
import { ServiceStep } from './steps/ServiceStep'
import { ArticlesStep } from './steps/ArticlesStep'
import { AddressStep } from './steps/AddressStep'
import { ScheduleStep } from './steps/ScheduleStep'
import { RecapStep } from './steps/RecapStep'
import { PaymentStep } from './steps/PaymentStep'
import { ConfirmationStep } from './steps/ConfirmationStep'

const stepLabels = [
  'Service',
  'Articles',
  'Collecte',
  'Livraison',
  'Créneau',
  'Récapitulatif',
  'Paiement',
]

export function OrderFlowPage() {
  const [step, setStep] = useState(0)
  const [state, setState] = useState(initialOrderFlowState)
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null)
  const [deliverySameAsPickup, setDeliverySameAsPickup] = useState(true)
  const createOrder = useCreateOrder()
  const toast = useToast()

  const next = () => setStep((s) => s + 1)
  const back = () => setStep((s) => Math.max(0, s - 1))

  const handleSelectPickup = (id: number) => {
    setState((s) => ({
      ...s,
      pickupAddressId: id,
      deliveryAddressId: deliverySameAsPickup ? id : s.deliveryAddressId,
    }))
  }

  const handleConfirmOrder = async () => {
    if (!state.serviceId || !state.pickupAddressId || !state.deliveryAddressId || !state.pickupDate || !state.timeSlotId) {
      return
    }
    try {
      const order = await createOrder.mutateAsync({
        service_id: state.serviceId,
        pickup_address_id: state.pickupAddressId,
        delivery_address_id: state.deliveryAddressId,
        pickup_date: state.pickupDate,
        time_slot_id: state.timeSlotId,
        notes: state.notes || undefined,
        items: Object.entries(state.items)
          .filter(([, qty]) => qty > 0)
          .map(([article_id, quantity]) => ({ article_id: Number(article_id), quantity })),
      })
      setCreatedOrder(order)
      next()
    } catch (error) {
      toast.error('Impossible de créer la commande', getApiErrorMessage(error))
    }
  }

  const confirmed = step === stepLabels.length

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {!confirmed && (
        <div className="mb-8">
          <StepIndicator steps={stepLabels} currentStep={step} />
        </div>
      )}

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        {step === 0 && (
          <ServiceStep
            selectedServiceId={state.serviceId}
            onSelect={(id) => setState((s) => ({ ...s, serviceId: id }))}
            onNext={next}
          />
        )}

        {step === 1 && (
          <ArticlesStep
            items={state.items}
            onChange={(articleId, quantity) =>
              setState((s) => ({ ...s, items: { ...s.items, [articleId]: quantity } }))
            }
            onBack={back}
            onNext={next}
          />
        )}

        {step === 2 && (
          <AddressStep
            title="Adresse de collecte"
            description="Où devons-nous récupérer vos vêtements ?"
            selectedAddressId={state.pickupAddressId}
            onSelect={handleSelectPickup}
            onBack={back}
            onNext={next}
          />
        )}

        {step === 3 && (
          <AddressStep
            title="Adresse de livraison"
            description="Où souhaitez-vous récupérer vos vêtements propres ?"
            selectedAddressId={state.deliveryAddressId}
            onSelect={(id) => {
              setDeliverySameAsPickup(false)
              setState((s) => ({ ...s, deliveryAddressId: id }))
            }}
            onBack={back}
            onNext={next}
            extraAction={
              <label className="mt-4 flex items-center gap-2 text-sm text-neutral-600">
                <input
                  type="checkbox"
                  checked={deliverySameAsPickup}
                  onChange={(e) => {
                    setDeliverySameAsPickup(e.target.checked)
                    if (e.target.checked) {
                      setState((s) => ({ ...s, deliveryAddressId: s.pickupAddressId }))
                    }
                  }}
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                Identique à l'adresse de collecte
              </label>
            }
          />
        )}

        {step === 4 && (
          <ScheduleStep
            pickupDate={state.pickupDate}
            timeSlotId={state.timeSlotId}
            onDateChange={(date) => setState((s) => ({ ...s, pickupDate: date, timeSlotId: null }))}
            onSlotChange={(id) => setState((s) => ({ ...s, timeSlotId: id }))}
            onBack={back}
            onNext={next}
          />
        )}

        {step === 5 && (
          <RecapStep
            state={state}
            onNotesChange={(notes) => setState((s) => ({ ...s, notes }))}
            onBack={back}
            onConfirm={handleConfirmOrder}
            isSubmitting={createOrder.isPending}
          />
        )}

        {step === 6 && createdOrder && (
          <PaymentStep
            order={createdOrder}
            onPaid={next}
            onBack={() => setStep(5)}
          />
        )}

        {confirmed && createdOrder && <ConfirmationStep order={createdOrder} />}
      </div>
    </div>
  )
}
