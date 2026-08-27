import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/toastStore'
import { getApiErrorMessage } from '@/lib/api'
import { useResetPassword } from './useAuth'

const schema = z
  .object({
    email: z.string().email('Adresse email invalide'),
    password: z.string().min(8, 'Au moins 8 caractères'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['password_confirmation'],
  })

type FormValues = z.infer<typeof schema>

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: searchParams.get('email') ?? '' },
  })
  const resetPassword = useResetPassword()
  const navigate = useNavigate()
  const toast = useToast()

  const onSubmit = async (values: FormValues) => {
    try {
      await resetPassword.mutateAsync({ ...values, token })
      toast.success('Mot de passe réinitialisé', 'Vous pouvez maintenant vous connecter.')
      navigate('/connexion', { replace: true })
    } catch (error) {
      toast.error('Réinitialisation impossible', getApiErrorMessage(error))
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900">Réinitialiser le mot de passe</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
        <Input label="Email" type="email" required error={errors.email?.message} {...register('email')} />
        <Input
          label="Nouveau mot de passe"
          type="password"
          required
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirmer le mot de passe"
          type="password"
          required
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />
        <Button type="submit" isLoading={resetPassword.isPending}>
          Réinitialiser
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        <Link to="/connexion" className="font-medium text-primary-600 hover:text-primary-700">
          Retour à la connexion
        </Link>
      </p>
    </div>
  )
}
