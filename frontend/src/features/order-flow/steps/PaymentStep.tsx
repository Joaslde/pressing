import { useEffect, useState } from 'react'
import { addFailedListener, addSuccessListener, openKkiapayWidget, removeKkiapayListener } from 'kkiapay'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/toastStore'
import { IconCreditCard } from '@/components/ui/icons'
import { getApiErrorMessage } from '@/lib/api'
import { usePaymentMethods, useCheckout, useVerifyPayment } from '@/features/payments/usePayments'
import type { Order, PaymentMethod } from '@/types'

interface PaymentStepProps {
  order: Order
  onPaid: () => void
  onBack: () => void
}

function formatFcfa(amount: number) {
  return `${amount.toLocaleString('fr-FR')} FCFA`
}

const methodLabels: Record<PaymentMethod, string> = {
  kkiapay: 'Kkiapay',
  fedapay: 'FedaPay',
}

export function PaymentStep({ order, onPaid, onBack }: PaymentStepProps) {
  const { data: methods, isLoading } = usePaymentMethods()
  const checkout = useCheckout(order.id)
  const verify = useVerifyPayment()
  const toast = useToast()
  const [payingWith, setPayingWith] = useState<PaymentMethod | null>(null)
  const [pendingPaymentId, setPendingPaymentId] = useState<number | null>(null)

  useEffect(() => {
    const onSuccess = (data?: { transactionId: string }) => {
      if (!pendingPaymentId || !data) return
      verify
        .mutateAsync({ paymentId: pendingPaymentId, transactionId: data.transactionId })
        .then((payment) => {
          if (payment.status === 'succeeded') {
            toast.success('Paiement confirmé', 'Votre commande a été payée avec succès.')
            onPaid()
          } else {
            toast.error('Paiement non confirmé', "Le paiement n'a pas pu être vérifié. Contactez le support si le montant a été débité.")
          }
        })
        .catch((error) => toast.error('Erreur de vérification', getApiErrorMessage(error)))
        .finally(() => setPayingWith(null))
    }

    const onFailed = () => {
      toast.error('Paiement échoué', 'La transaction a été annulée ou a échoué.')
      setPayingWith(null)
    }

    addSuccessListener(onSuccess)
    addFailedListener(onFailed)
    return () => {
      removeKkiapayListener('success')
      removeKkiapayListener('failed')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPaymentId])

  const payWithKkiapay = async () => {
    setPayingWith('kkiapay')
    try {
      const { payment_id, checkout: payload } = await checkout.mutateAsync({
        method: 'kkiapay',
        amount: order.estimated_amount,
      })
      setPendingPaymentId(payment_id)
      openKkiapayWidget({
        amount: payload.amount ?? order.estimated_amount,
        key: payload.public_key,
        sandbox: payload.sandbox,
        data: payload.transaction_ref,
      })
    } catch (error) {
      toast.error('Impossible de démarrer le paiement', getApiErrorMessage(error))
      setPayingWith(null)
    }
  }

  const payWithFedapay = async () => {
    setPayingWith('fedapay')
    try {
      const { checkout: payload } = await checkout.mutateAsync({
        method: 'fedapay',
        amount: order.estimated_amount,
      })
      if (payload.payment_url) {
        window.location.href = payload.payment_url
      }
    } catch (error) {
      toast.error('Impossible de démarrer le paiement', getApiErrorMessage(error))
      setPayingWith(null)
    }
  }

  const handlers: Record<PaymentMethod, () => void> = {
    kkiapay: payWithKkiapay,
    fedapay: payWithFedapay,
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Paiement</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Commande {order.order_number} - montant à payer :{' '}
        <span className="font-semibold text-neutral-900">{formatFcfa(order.estimated_amount)}</span>
      </p>

      {isLoading && (
        <div className="mt-8 flex justify-center py-8">
          <Spinner className="text-primary-600" />
        </div>
      )}

      {methods && methods.length === 0 && (
        <div className="mt-6">
          <EmptyState
            title="Aucun moyen de paiement disponible"
            description="Contactez l'administrateur du pressing pour finaliser votre commande."
          />
        </div>
      )}

      {methods && methods.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {methods.map((method) => (
            <button
              key={method}
              type="button"
              onClick={handlers[method]}
              disabled={payingWith !== null}
              className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 text-left transition-colors hover:border-primary-400 disabled:opacity-60"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <IconCreditCard width={18} height={18} />
                </span>
                <span className="text-sm font-medium text-neutral-900">Payer avec {methodLabels[method]}</span>
              </span>
              {payingWith === method && <Spinner size={18} className="text-primary-600" />}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Button variant="outline" onClick={onBack} disabled={payingWith !== null}>
          Retour
        </Button>
      </div>
    </div>
  )
}
