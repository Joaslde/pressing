import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonText } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { useArticles } from '@/features/catalog/useCatalog'

interface ArticlesStepProps {
  items: Record<number, number>
  onChange: (articleId: number, quantity: number) => void
  onBack: () => void
  onNext: () => void
}

function formatFcfa(amount: number) {
  return `${amount.toLocaleString('fr-FR')} FCFA`
}

export function ArticlesStep({ items, onChange, onBack, onNext }: ArticlesStepProps) {
  const { data: articles, isLoading, isError, refetch } = useArticles()
  const totalItems = Object.values(items).reduce((sum, qty) => sum + qty, 0)

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Sélectionnez vos articles</h2>
      <p className="mt-1 text-sm text-neutral-500">Indiquez la quantité pour chaque type de vêtement.</p>

      {isLoading && <div className="mt-6"><SkeletonText lines={5} /></div>}
      {isError && <div className="mt-6"><ErrorState onRetry={() => refetch()} /></div>}
      {articles && articles.length === 0 && (
        <div className="mt-6"><EmptyState title="Aucun article disponible" /></div>
      )}

      {articles && articles.length > 0 && (
        <div className="mt-6 divide-y divide-neutral-100 rounded-xl border border-neutral-200">
          {articles.map((article) => {
            const quantity = items[article.id] ?? 0
            return (
              <div key={article.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{article.name}</p>
                  <p className="text-xs text-neutral-500">{formatFcfa(article.price)} / unité</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onChange(article.id, Math.max(0, quantity - 1))}
                    disabled={quantity === 0}
                    aria-label={`Diminuer la quantité de ${article.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-neutral-900" aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onChange(article.id, quantity + 1)}
                    aria-label={`Augmenter la quantité de ${article.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:border-primary-500 hover:text-primary-600"
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <div className="flex items-center gap-4">
          {totalItems > 0 && (
            <span className="text-sm text-neutral-500">{totalItems} article{totalItems > 1 ? 's' : ''}</span>
          )}
          <Button onClick={onNext} disabled={totalItems === 0}>
            Continuer
          </Button>
        </div>
      </div>
    </div>
  )
}
