import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-primary-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-neutral-900">Page introuvable</h1>
      <p className="mt-2 max-w-sm text-sm text-neutral-500">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="mt-6">
        <Button>Retour à l'accueil</Button>
      </Link>
    </div>
  )
}
