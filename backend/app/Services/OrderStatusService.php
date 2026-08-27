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
            throw new DomainException(
                "Transition invalide: {$order->status->value} → {$to->value}."
            );
        }

        $order->update(['status' => $to]);
        $order->user->notify(new OrderStatusChanged($order));

        return $order->fresh();
    }
}
