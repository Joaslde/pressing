import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { IconCheck } from '@/components/ui/icons'
import type { Order } from '@/types'

interface ConfirmationStepProps {
  order: Order
}

export function ConfirmationStep({ order }: ConfirmationStepProps) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-success">
        <IconCheck width={32} height={32} />
      </div>
      <h2 className="mt-5 text-2xl font-bold text-neutral-900">Commande confirmée !</h2>
      <p className="mt-2 max-w-md text-sm text-neutral-600">
        Votre commande <span className="font-medium text-neutral-900">{order.order_number}</span> a
        bien été enregistrée. Vous recevrez une notification à chaque étape.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to={`/client/commandes/${order.id}`}>
          <Button>Suivre ma commande</Button>
        </Link>
        <Link to="/">
          <Button variant="outline">Retour à l'accueil</Button>
        </Link>
      </div>
    </div>
  )
}
