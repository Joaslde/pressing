import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { GOOGLE_CLIENT_ID, GoogleSignInButton } from '@/components/GoogleSignInButton'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/toastStore'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api'
import { phoneSchema } from '@/lib/validation'
import { useGoogleLogin, useRegister } from './useAuth'

const schema = z
  .object({
    first_name: z.string().min(1, 'Le prénom est requis').max(100),
    last_name: z.string().min(1, 'Le nom est requis').max(100),
    phone: phoneSchema,
    email: z.string().email('Adresse email invalide'),
    password: z.string().min(8, 'Au moins 8 caractères'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['password_confirmation'],
  })

type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })
  const registerUser = useRegister()
  const googleLogin = useGoogleLogin()
  const navigate = useNavigate()
  const toast = useToast()

  const onSubmit = async (values: FormValues) => {
    try {
      const data = await registerUser.mutateAsync(values)
      toast.success('Bienvenue !', 'Votre compte a été créé avec succès.')
      navigate(data.redirect_to, { replace: true })
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        for (const [field, messages] of Object.entries(fieldErrors)) {
          setError(field as keyof FormValues, { message: messages[0] })
        }
      } else {
        toast.error('Inscription impossible', getApiErrorMessage(error))
      }
    }
  }

  const handleGoogleCredential = async (credential: string) => {
    try {
      const data = await googleLogin.mutateAsync(credential)
      toast.success('Bienvenue !', 'Votre compte a été créé avec succès.')
      navigate(data.redirect_to, { replace: true })
    } catch (error) {
      toast.error('Connexion Google impossible', getApiErrorMessage(error))
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900">Créer un compte</h1>
      <p className="mt-1 text-sm text-neutral-500">Rejoignez X-Pressing en quelques secondes.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Prénom" required error={errors.first_name?.message} {...register('first_name')} />
          <Input label="Nom" required error={errors.last_name?.message} {...register('last_name')} />
        </div>
        <Input
          label="Téléphone"
          type="tel"
          required
          placeholder="+229 00 00 00 00"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input label="Email" type="email" autoComplete="email" required error={errors.email?.message} {...register('email')} />
        <Input
          label="Mot de passe"
          type="password"
          autoComplete="new-password"
          required
          hint="8 caractères minimum"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirmer le mot de passe"
          type="password"
          autoComplete="new-password"
          required
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />
        <Button type="submit" isLoading={registerUser.isPending} className="mt-2">
          Créer mon compte
        </Button>
      </form>

      {GOOGLE_CLIENT_ID && (
        <>
          <div className="my-6 flex items-center gap-3 text-xs text-neutral-400">
            <div className="h-px flex-1 bg-neutral-200" />
            ou
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <GoogleSignInButton onCredential={handleGoogleCredential} />
        </>
      )}

      <p className="mt-6 text-center text-sm text-neutral-600">
        Déjà un compte ?{' '}
        <Link to="/connexion" className="font-medium text-primary-600 hover:text-primary-700">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
