import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { IconShirt } from '@/components/ui/icons'
import { useServices } from '@/features/catalog/useCatalog'
import servicesBackground from '@/assets/images/services-background.webp'

export function ServicesPage() {
  const { data: services, isLoading, isError, refetch } = useServices()

  return (
    <div className="relative isolate">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${servicesBackground})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-white/20" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl rounded-2xl bg-white/90 px-6 py-8 text-center shadow-sm backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-neutral-900">Nos services</h1>
          <p className="mt-2 text-neutral-600">
            Choisissez le traitement adapté à vos vêtements. Les descriptions et prestations
            définitives seront validées par le pressing.
          </p>
        </div>

        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {isError && <ErrorState onRetry={() => refetch()} />}

        {services && services.length === 0 && (
          <EmptyState title="Aucun service disponible pour le moment" />
        )}

        {services && services.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            {services.map((service) => (
              <Card key={service.id}>
                <CardBody>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <IconShirt />
                  </div>
                  <h2 className="text-lg font-semibold text-neutral-900">{service.name}</h2>
                  <p className="mt-2 text-sm text-neutral-600">{service.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/commander">
            <Button size="lg">Commander maintenant</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
