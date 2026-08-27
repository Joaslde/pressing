import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getApiErrorMessage } from '@/lib/api'
import { useForgotPassword } from './useAuth'

const schema = z.object({ email: z.string().email('Adresse email invalide') })
type FormValues = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })
  const forgotPassword = useForgotPassword()

  const onSubmit = (values: FormValues) => forgotPassword.mutate(values.email)

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900">Mot de passe oublié</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Indiquez votre email, nous vous enverrons un lien de réinitialisation.
      </p>

      {forgotPassword.isSuccess ? (
        <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-success">
          Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
          <Input label="Email" type="email" required error={errors.email?.message} {...register('email')} />
          {forgotPassword.isError && (
            <p className="text-sm text-danger">{getApiErrorMessage(forgotPassword.error)}</p>
          )}
          <Button type="submit" isLoading={forgotPassword.isPending}>
            Envoyer le lien
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-neutral-600">
        <Link to="/connexion" className="font-medium text-primary-600 hover:text-primary-700">
          Retour à la connexion
        </Link>
      </p>
    </div>
  )
}
