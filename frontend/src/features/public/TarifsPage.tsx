import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { SkeletonText } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { useArticles, useFees } from '@/features/catalog/useCatalog'

function formatFcfa(amount: number) {
  return `${amount.toLocaleString('fr-FR')} FCFA`
}

export function TarifsPage() {
  const articles = useArticles()
  const fees = useFees()

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-neutral-900">Nos tarifs</h1>
        <p className="mt-2 text-neutral-600">
          Consultez nos prix avant de passer commande. Le montant final dépend des articles
          choisis et des frais de collecte/livraison.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-5 py-3 font-medium">Article</th>
              <th className="px-5 py-3 text-right font-medium">Prix unitaire</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {articles.isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={2} className="px-5 py-4">
                    <SkeletonText lines={1} />
                  </td>
                </tr>
              ))}

            {articles.data?.map((article) => (
              <tr key={article.id}>
                <td className="px-5 py-3 text-neutral-800">{article.name}</td>
                <td className="px-5 py-3 text-right font-medium text-neutral-900">
                  {formatFcfa(article.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {articles.isError && <div className="mt-4"><ErrorState onRetry={() => articles.refetch()} /></div>}
      {articles.data && articles.data.length === 0 && (
        <div className="mt-4"><EmptyState title="Aucun tarif disponible pour le moment" /></div>
      )}

      {fees.data && fees.data.length > 0 && (
        <div className="mt-8 rounded-xl bg-neutral-50 p-5">
          <h2 className="mb-3 text-sm font-semibold text-neutral-900">Frais additionnels</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {fees.data.map((fee) => (
              <li key={fee.id} className="flex justify-between text-neutral-600">
                <span>{fee.label}</span>
                <span className="font-medium text-neutral-900">{formatFcfa(fee.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-neutral-400">
        Les prix affichés sont indicatifs et peuvent être ajustés par le pressing.
      </p>

      <div className="mt-10 text-center">
        <Link to="/commander">
          <Button size="lg">Commander maintenant</Button>
        </Link>
      </div>
    </div>
  )
}
