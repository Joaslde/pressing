import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import {
  IconBox,
  IconCheck,
  IconClock,
  IconCreditCard,
  IconMapPin,
  IconShirt,
  IconTruck,
} from '@/components/ui/icons'
import { useServices } from '@/features/catalog/useCatalog'
import { HeroIllustration } from '@/components/HeroIllustration'

const steps = [
  { title: 'Choisissez votre service', icon: <IconShirt /> },
  { title: 'Programmez la collecte', icon: <IconClock /> },
  { title: 'Nous récupérons vos vêtements', icon: <IconTruck /> },
  { title: 'Nous les nettoyons et les traitons', icon: <IconBox /> },
  { title: 'Nous vous les livrons', icon: <IconCheck /> },
]

const advantages = [
  { title: 'Collecte à domicile', description: "Plus besoin de vous déplacer." },
  { title: 'Livraison à domicile', description: 'Vos vêtements livrés où vous êtes.' },
  { title: 'Commande en ligne', description: 'Simple, rapide, en quelques clics.' },
  { title: 'Suivi de commande', description: 'Suivez chaque étape en temps réel.' },
  { title: 'Paiement sécurisé', description: 'Via FedaPay et Kkiapay.' },
  { title: 'Gain de temps', description: 'Concentrez-vous sur l\'essentiel.' },
]

export function HomePage() {
  const { data: services, isLoading, isError, refetch } = useServices()

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-neutral-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl">
              Votre linge propre, repassé et{' '}
              <span className="text-primary-600">livré directement chez vous.</span>
            </h1>
            <p className="mt-5 text-lg text-neutral-600">
              X-Pressing collecte, nettoie, repasse et livre vos vêtements. Commandez en ligne en
              quelques minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/commander">
                <Button size="lg">Commander maintenant</Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline">
                  Découvrir nos services
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-4/3 w-full overflow-hidden rounded-2xl shadow-lg">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-neutral-900">Nos services</h2>
          <p className="mt-2 text-neutral-600">Un service adapté à chaque besoin.</p>
        </div>

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {isError && <ErrorState onRetry={() => refetch()} />}

        {services && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card key={service.id} className="transition-shadow hover:shadow-md">
                <CardBody>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <IconShirt />
                  </div>
                  <h3 className="font-semibold text-neutral-900">{service.name}</h3>
                  <p className="mt-1.5 text-sm text-neutral-600 line-clamp-3">{service.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Comment ça marche */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-neutral-900">Comment ça marche ?</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white">
                  {step.icon}
                </div>
                <p className="text-xs font-medium text-primary-600">Étape {i + 1}</p>
                <p className="mt-1 text-sm font-medium text-neutral-800">{step.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-neutral-900">Pourquoi choisir X-Pressing ?</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((advantage) => (
            <div key={advantage.title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <IconCheck />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">{advantage.title}</h3>
                <p className="mt-1 text-sm text-neutral-600">{advantage.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
          <IconMapPin className="text-white" width={32} height={32} />
          <h2 className="text-3xl font-bold text-white">Prêt à gagner du temps ?</h2>
          <p className="max-w-xl text-primary-50">
            Programmez votre collecte dès maintenant et laissez-nous nous occuper du reste.
          </p>
          <Link to="/commander">
            <Button size="lg" variant="secondary">
              Commander maintenant
            </Button>
          </Link>
        </div>
      </section>

      {/* Paiement */}
      <section className="mx-auto max-w-6xl px-4 py-10 text-center sm:px-6">
        <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
          <IconCreditCard width={16} height={16} />
          Paiement sécurisé via FedaPay et Kkiapay
        </div>
      </section>
    </div>
  )
}
