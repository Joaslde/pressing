import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import {
  IconBox,
  IconCheck,
  IconClock,
  IconCreditCard,
  IconShirt,
  IconTruck,
} from '@/components/ui/icons'
import { useServices } from '@/features/catalog/useCatalog'
import { fadeInUp, prefersReducedMotion, scaleIn, staggerContainer, viewportOnce } from '@/lib/motion'
import heroImage from '@/assets/images/panneau-livraison.png'
import ctaImage from '@/assets/images/panneau-vetements.png'

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
    <div className="overflow-x-clip">
      {/* Hero */}
      <section className="relative overflow-hidden bg-neutral-50">
        {/* Aurora glow - decorative, sits behind the text at low opacity so
            contrast is unaffected; a slow drift keeps the page feeling alive
            without being distracting. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-primary-300/40 blur-3xl"
          animate={prefersReducedMotion ? undefined : { x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-24 h-[380px] w-[380px] rounded-full bg-amber-200/40 blur-3xl"
          animate={prefersReducedMotion ? undefined : { x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer}
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl"
            >
              Votre linge propre, repassé et{' '}
              <motion.span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, var(--color-primary-600), var(--color-primary-400), var(--color-primary-600))',
                  backgroundSize: '200% 100%',
                }}
                animate={
                  prefersReducedMotion ? undefined : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }
                }
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              >
                livré directement chez vous.
              </motion.span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-5 text-lg text-neutral-600">
              X-Pressing collecte, nettoie, repasse et livre vos vêtements. Commandez en ligne en
              quelques minutes.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
              <Link to="/commander">
                <Button size="lg">Commander maintenant</Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline">
                  Découvrir nos services
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <motion.div
              className="aspect-[3/2] w-full overflow-hidden rounded-2xl shadow-lg"
              animate={prefersReducedMotion ? undefined : { y: [0, -12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src={heroImage}
                alt="Un livreur X-Pressing remet un sac de linge propre à une cliente devant chez elle"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <motion.div
          className="mb-10 text-center"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold text-neutral-900">Nos services</h2>
          <p className="mt-2 text-neutral-600">Un service adapté à chaque besoin.</p>
        </motion.div>

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {isError && <ErrorState onRetry={() => refetch()} />}

        {services && (
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer}
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Card className="h-full transition-shadow duration-300 hover:shadow-[0_12px_32px_-8px_rgba(242,118,15,0.25)]">
                  <CardBody>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      <IconShirt />
                    </div>
                    <h3 className="font-semibold text-neutral-900">{service.name}</h3>
                    <p className="mt-1.5 text-sm text-neutral-600 line-clamp-3">{service.description}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Comment ça marche */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            className="mb-10 text-center"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-neutral-900">Comment ça marche ?</h2>
          </motion.div>
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer}
          >
            {steps.map((step, i) => (
              <motion.div key={step.title} variants={scaleIn} className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white">
                  {step.icon}
                </div>
                <p className="text-xs font-medium text-primary-600">Étape {i + 1}</p>
                <p className="mt-1 text-sm font-medium text-neutral-800">{step.title}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Avantages */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <motion.div
          className="mb-10 text-center"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold text-neutral-900">Pourquoi choisir X-Pressing ?</h2>
        </motion.div>
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {advantages.map((advantage) => (
            <motion.div key={advantage.title} variants={fadeInUp} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <IconCheck />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">{advantage.title}</h3>
                <p className="mt-1 text-sm text-neutral-600">{advantage.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
          <motion.div
            className="text-center md:text-left"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-white">
              Prêt à gagner du temps ?
            </motion.h2>
            <motion.p variants={fadeInUp} className="mx-auto mt-3 max-w-xl text-primary-50 md:mx-0">
              Programmez votre collecte dès maintenant et laissez-nous nous occuper du reste.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-6">
              <Link to="/commander">
                <Button size="lg" variant="secondary">
                  Commander maintenant
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl shadow-lg"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={ctaImage}
              alt="Vêtements propres suspendus sur un portant"
              className="w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Paiement */}
      <motion.section
        className="mx-auto max-w-6xl px-4 py-10 text-center sm:px-6"
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={fadeInUp}
      >
        <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
          <IconCreditCard width={16} height={16} />
          Paiement sécurisé via FedaPay et Kkiapay
        </div>
      </motion.section>
    </div>
  )
}
