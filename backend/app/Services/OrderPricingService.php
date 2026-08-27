<?php

namespace App\Services;

use App\Enums\FeeType;
use App\Models\Article;
use App\Models\Fee;
use Illuminate\Support\Collection;

/**
 * Centralizes the price calculation described in the cahier (§6, §10):
 * total = Σ(article qty × unit price) + pickup fee + delivery fee.
 * Prices are fixed per article regardless of the chosen service - intentional,
 * matches the cahier's example exactly rather than adding an unrequested
 * price-per-service matrix.
 */
class OrderPricingService
{
    /**
     * @param  array<int, array{article_id: int, quantity: int}>  $items
     * @return array{
     *     items: Collection<int, array{article_id: int, name: string, quantity: int, unit_price: float, subtotal: float}>,
     *     items_subtotal: float,
     *     pickup_fee: float,
     *     delivery_fee: float,
     *     total: float,
     * }
     */
    public function calculate(array $items): array
    {
        $articleIds = array_column($items, 'article_id');
        $articles = Article::whereIn('id', $articleIds)->where('is_active', true)->get()->keyBy('id');

        $lines = collect($items)->map(function (array $item) use ($articles) {
            /** @var Article|null $article */
            $article = $articles->get($item['article_id']);

            if (! $article) {
                throw new \InvalidArgumentException("Article introuvable ou inactif: {$item['article_id']}");
            }

            $unitPrice = (float) $article->price;
            $subtotal = round($unitPrice * $item['quantity'], 2);

            return [
                'article_id' => $article->id,
                'name' => $article->name,
                'quantity' => $item['quantity'],
                'unit_price' => $unitPrice,
                'subtotal' => $subtotal,
            ];
        });

        $itemsSubtotal = round((float) $lines->sum('subtotal'), 2);
        $pickupFee = $this->activeFeeAmount(FeeType::Pickup);
        $deliveryFee = $this->activeFeeAmount(FeeType::Delivery);

        return [
            'items' => $lines,
            'items_subtotal' => $itemsSubtotal,
            'pickup_fee' => $pickupFee,
            'delivery_fee' => $deliveryFee,
            'total' => round($itemsSubtotal + $pickupFee + $deliveryFee, 2),
        ];
    }

    private function activeFeeAmount(FeeType $type): float
    {
        $fee = Fee::where('type', $type)->where('is_active', true)->first();

        return $fee ? (float) $fee->amount : 0.0;
    }
}
