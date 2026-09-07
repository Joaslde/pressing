<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Notifications\OrderStatusChanged;
use DomainException;

/**
 * Single entry point for order status changes so the cahier's lifecycle
 * (§13) is always enforced, instead of controllers writing `status` directly.
 */
class OrderStatusService
{
    public function transition(Order $order, OrderStatus $to): Order
    {
        if (! $order->status->canTransitionTo($to)) {
            throw new DomainException($this->invalidTransitionMessage($order->status, $to));
        }

        $order->update(['status' => $to]);
        $order->user->notify(new OrderStatusChanged($order));

        return $order->fresh();
    }

    /**
     * Plain-language explanation (not the raw enum values) so an admin
     * reading the error toast understands what's wrong and what to do,
     * instead of a technical "pending_payment -> picked_up" string.
     */
    private function invalidTransitionMessage(OrderStatus $from, OrderStatus $to): string
    {
        $validPredecessors = collect(OrderStatus::cases())
            ->filter(fn (OrderStatus $case) => $case->canTransitionTo($to))
            ->map(fn (OrderStatus $case) => $case->label());

        if ($validPredecessors->isEmpty()) {
            return sprintf(
                'Impossible de passer la commande à « %s » : ce statut ne peut plus être modifié.',
                $to->label()
            );
        }

        return sprintf(
            'Impossible de passer la commande à « %s » : elle est actuellement « %s », alors qu\'elle doit être « %s » pour cette action.',
            $to->label(),
            $from->label(),
            $validPredecessors->implode(' » ou « ')
        );
    }
}
