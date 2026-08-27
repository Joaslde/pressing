import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/toastStore'
import { IconPlus, IconTruck } from '@/components/ui/icons'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api'
import { phoneSchema } from '@/lib/validation'
import { useAdminLivreurs, useCreateLivreur, useToggleLivreurActive } from './useAdmin'

const schema = z.object({
  first_name: z.string().min(1, 'Le prénom est requis').max(100),
  last_name: z.string().min(1, 'Le nom est requis').max(100),
  phone: phoneSchema,
  email: z.string().email('Adresse email invalide'),
})

type FormValues = z.infer<typeof schema>

export function AdminLivreursPage() {
  const { data: livreurs, isLoading, isError, refetch } = useAdminLivreurs()
  const createLivreur = useCreateLivreur()
  const toggleActive = useToggleLivreurActive()
  const toast = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const openCreate = () => {
    reset()
    setModalOpen(true)
  }

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await createLivreur.mutateAsync(values)
      setCreatedCredentials({ email: values.email, password: result.temporary_password })
      reset()
      setModalOpen(false)
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        for (const [field, messages] of Object.entries(fieldErrors)) {
          setError(field as keyof FormValues, { message: messages[0] })
        }
      } else {
        toast.error('Création impossible', getApiErrorMessage(error))
      }
    }
  }

  const handleToggle = async (id: number) => {
    try {
      await toggleActive.mutateAsync(id)
      toast.success('Statut mis à jour')
    } catch (error) {
      toast.error('Action impossible', getApiErrorMessage(error))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Livreurs</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Les comptes livreurs sont créés uniquement par l'administrateur.
          </p>
        </div>
        <Button size="sm" leftIcon={<IconPlus width={16} height={16} />} onClick={openCreate}>
          Ajouter un livreur
        </Button>
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {isError && <ErrorState onRetry={() => refetch()} />}

        {livreurs && livreurs.length === 0 && (
          <EmptyState icon={<IconTruck width={26} height={26} />} title="Aucun livreur enregistré" />
        )}

        {livreurs && livreurs.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {livreurs.map((livreur) => (
              <Card key={livreur.id}>
                <CardBody className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-neutral-900">{livreur.full_name}</p>
                    <p className="text-xs text-neutral-500">{livreur.phone} - {livreur.email}</p>
                    <div className="mt-1.5 flex gap-1.5">
                      <Badge tone={livreur.is_active ? 'success' : 'danger'}>
                        {livreur.is_active ? 'Actif' : 'Désactivé'}
                      </Badge>
                      <Badge tone="neutral">{livreur.status_label}</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleToggle(livreur.id)} isLoading={toggleActive.isPending}>
                    {livreur.is_active ? 'Désactiver' : 'Activer'}
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Ajouter un livreur">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prénom" required error={errors.first_name?.message} {...register('first_name')} />
            <Input label="Nom" required error={errors.last_name?.message} {...register('last_name')} />
          </div>
          <Input
            label="Téléphone"
            required
            placeholder="+229 00 00 00 00"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input label="Email" type="email" required error={errors.email?.message} {...register('email')} />
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" isLoading={createLivreur.isPending}>
              Créer le compte
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!createdCredentials} onClose={() => setCreatedCredentials(null)} title="Compte livreur créé" size="sm">
        <p className="text-sm text-neutral-600">
          Transmettez ces identifiants au livreur - ils ne seront affichés qu'une seule fois.
        </p>
        <div className="mt-4 flex flex-col gap-2 rounded-lg bg-neutral-50 p-3 text-sm">
          <div>
            <span className="text-neutral-500">Email : </span>
            <span className="font-medium text-neutral-900">{createdCredentials?.email}</span>
          </div>
          <div>
            <span className="text-neutral-500">Mot de passe temporaire : </span>
            <span className="font-mono font-medium text-neutral-900">{createdCredentials?.password}</span>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => setCreatedCredentials(null)}>J'ai noté les identifiants</Button>
        </div>
      </Modal>
    </div>
  )
}
