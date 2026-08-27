import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonText } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/toastStore'
import { IconBox, IconEdit, IconPlus, IconTrash } from '@/components/ui/icons'
import { getApiErrorMessage } from '@/lib/api'
import { articlesAdmin } from './useAdminCatalog'
import type { Article } from '@/types'

const emptyForm = { name: '', description: '', price: '' }

function formatFcfa(amount: number) {
  return `${amount.toLocaleString('fr-FR')} FCFA`
}

export function AdminArticlesPage() {
  const { data: articles, isLoading, isError, refetch } = articlesAdmin.useList()
  const createArticle = articlesAdmin.useCreate()
  const updateArticle = articlesAdmin.useUpdate()
  const removeArticle = articlesAdmin.useRemove()
  const toast = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (article: Article) => {
    setEditingId(article.id)
    setForm({ name: article.name, description: article.description ?? '', price: String(article.price) })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = { name: form.name, description: form.description, price: Number(form.price) }
      if (editingId) {
        await updateArticle.mutateAsync({ id: editingId, ...payload })
        toast.success('Article mis à jour')
      } else {
        await createArticle.mutateAsync(payload)
        toast.success('Article créé')
      }
      setModalOpen(false)
    } catch (error) {
      toast.error('Une erreur est survenue', getApiErrorMessage(error))
    }
  }

  const handleDeactivate = async (id: number) => {
    try {
      await removeArticle.mutateAsync(id)
      toast.success('Article désactivé')
    } catch (error) {
      toast.error('Action impossible', getApiErrorMessage(error))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Articles</h1>
          <p className="mt-1 text-sm text-neutral-500">Gérez les types de vêtements et leurs prix.</p>
        </div>
        <Button size="sm" leftIcon={<IconPlus width={16} height={16} />} onClick={openCreate}>
          Ajouter
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200">
        {isLoading && <div className="p-5"><SkeletonText lines={4} /></div>}
        {isError && <div className="p-5"><ErrorState onRetry={() => refetch()} /></div>}
        {articles && articles.length === 0 && (
          <div className="p-5"><EmptyState icon={<IconBox width={26} height={26} />} title="Aucun article" /></div>
        )}

        {articles && articles.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Article</th>
                <th className="px-4 py-3 font-medium">Prix</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="px-4 py-3 text-neutral-800">{article.name}</td>
                  <td className="px-4 py-3 font-medium text-neutral-900">{formatFcfa(article.price)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={article.is_active ? 'success' : 'neutral'}>
                      {article.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(article)} aria-label={`Modifier ${article.name}`} className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
                        <IconEdit width={15} height={15} />
                      </button>
                      {article.is_active && (
                        <button onClick={() => handleDeactivate(article.id)} aria-label={`Désactiver ${article.name}`} className="rounded-md p-1.5 text-neutral-400 hover:bg-red-50 hover:text-danger">
                          <IconTrash width={15} height={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Modifier l'article" : 'Nouvel article'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input label="Nom" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input label="Prix (FCFA)" type="number" min={0} required value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
          <Input label="Description (optionnel)" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button type="submit" isLoading={createArticle.isPending || updateArticle.isPending}>Enregistrer</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
