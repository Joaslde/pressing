import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { IconBox, IconCheck, IconClock, IconShirt, IconTruck } from '@/components/ui/icons'
import howItWorksImage from '@/assets/images/panneau-lavage.webp'

const steps = [
  {
    title: 'Choisissez votre service',
    description: 'Lavage à la main, lavage + repassage, repassage seul ou nettoyage à sec.',
    icon: <IconShirt />,
  },
  {
    title: 'Programmez la collecte',
    description: 'Renseignez votre adresse (géolocalisation ou saisie manuelle) et un créneau.',
    icon: <IconClock />,
  },
  {
    title: 'Nous récupérons vos vêtements',
    description: 'Un livreur passe chez vous au créneau choisi.',
    icon: <IconTruck />,
  },
  {
    title: 'Nous les nettoyons et les traitons',
    description: 'Vos vêtements sont pris en charge selon le service sélectionné.',
    icon: <IconBox />,
  },
  {
    title: 'Nous vous les livrons',
    description: 'Vos vêtements propres et repassés sont livrés chez vous.',
    icon: <IconCheck />,
  },
]

export function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-neutral-900">Comment ça marche ?</h1>
        <p className="mt-2 text-neutral-600">De la commande à la livraison, en 5 étapes simples.</p>
      </div>

      <div className="mx-auto mb-12 max-w-lg overflow-hidden rounded-2xl shadow-md">
        <img
          src={howItWorksImage}
          alt="Machine à laver, linge propre et pictogrammes des services : lavage, repassage, lavage + repassage, nettoyage à sec"
          className="w-full"
        />
      </div>

      <ol className="flex flex-col gap-6">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-5">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                {step.icon}
              </div>
              {i < steps.length - 1 && <div className="mt-2 h-full w-0.5 flex-1 bg-neutral-200" />}
            </div>
            <div className="pb-6">
              <p className="text-xs font-medium text-primary-600">Étape {i + 1}</p>
              <h2 className="mt-0.5 font-semibold text-neutral-900">{step.title}</h2>
              <p className="mt-1 text-sm text-neutral-600">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 text-center">
        <Link to="/commander">
          <Button size="lg">Commander maintenant</Button>
        </Link>
      </div>
    </div>
  )
}
