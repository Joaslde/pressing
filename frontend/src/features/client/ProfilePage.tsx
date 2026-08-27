import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardBody } from '@/components/ui/Card'
import { useToast } from '@/components/ui/toastStore'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api'
import { phoneSchema } from '@/lib/validation'
import { useAuthStore } from '@/stores/authStore'
import { useUpdateProfile } from './useUpdateProfile'

const schema = z.object({
  first_name: z.string().min(1, 'Le prénom est requis').max(100),
  last_name: z.string().min(1, 'Le nom est requis').max(100),
  phone: phoneSchema,
  email: z.string().email('Adresse email invalide'),
})

type FormValues = z.infer<typeof schema>

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const updateProfile = useUpdateProfile()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        email: user.email,
      })
    }
  }, [user, reset])

  const onSubmit = async (values: FormValues) => {
    try {
      await updateProfile.mutateAsync(values)
      toast.success('Profil mis à jour')
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        for (const [field, messages] of Object.entries(fieldErrors)) {
          setError(field as keyof FormValues, { message: messages[0] })
        }
      } else {
        toast.error('Mise à jour impossible', getApiErrorMessage(error))
      }
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-neutral-900">Mon profil</h1>
      <p className="mt-1 text-sm text-neutral-500">Gérez vos informations personnelles.</p>

      <Card className="mt-6">
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Prénom" required error={errors.first_name?.message} {...register('first_name')} />
              <Input label="Nom" required error={errors.last_name?.message} {...register('last_name')} />
            </div>
            <Input label="Téléphone" required error={errors.phone?.message} {...register('phone')} />
            <Input label="Email" type="email" required error={errors.email?.message} {...register('email')} />
            <div className="flex justify-end">
              <Button type="submit" disabled={!isDirty} isLoading={updateProfile.isPending}>
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
