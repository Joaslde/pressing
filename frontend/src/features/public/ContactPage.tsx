import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/toastStore'

const schema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Adresse email invalide'),
  message: z.string().min(10, 'Votre message est trop court'),
})

type FormValues = z.infer<typeof schema>

export function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })
  const toast = useToast()

  // No backend contact endpoint yet in the MVP scope (cahier §24 lists
  // "Contact" only as a public page) — this simulates submission so the UX
  // is complete and ready to wire up once a channel (email/CRM) is chosen.
  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    toast.success('Message envoyé', 'Nous vous répondrons dans les plus brefs délais.')
    reset()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-neutral-900">Contact</h1>
        <p className="mt-2 text-neutral-600">Une question ? Écrivez-nous, nous vous répondrons rapidement.</p>
      </div>

      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Nos coordonnées</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
            <li>contact@x-pressing.example</li>
            <li>+229 01 00 00 00</li>
            <li>Cotonou, Bénin</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input label="Nom" required error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" required error={errors.email?.message} {...register('email')} />
          <Textarea label="Message" required rows={5} error={errors.message?.message} {...register('message')} />
          <Button type="submit" isLoading={isSubmitting}>
            Envoyer
          </Button>
        </form>
      </div>
    </div>
  )
}
