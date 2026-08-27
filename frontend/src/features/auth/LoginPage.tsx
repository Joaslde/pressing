import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/toastStore'
import { getApiErrorMessage } from '@/lib/api'
import { useLogin } from './useAuth'

const schema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })
  const login = useLogin()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const from = (location.state as { from?: Location })?.from?.pathname

  const onSubmit = async (values: FormValues) => {
    try {
      const data = await login.mutateAsync(values)
      navigate(from ?? data.redirect_to, { replace: true })
    } catch (error) {
      toast.error('Connexion impossible', getApiErrorMessage(error))
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900">Se connecter</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Accédez à votre espace client, livreur ou administrateur.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          required
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="flex justify-end">
          <Link to="/mot-de-passe-oublie" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Mot de passe oublié ?
          </Link>
        </div>
        <Button type="submit" isLoading={login.isPending} className="mt-2">
          Se connecter
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Pas encore de compte ?{' '}
        <Link to="/inscription" className="font-medium text-primary-600 hover:text-primary-700">
          Créer un compte
        </Link>
      </p>
    </div>
  )
}
