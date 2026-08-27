<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function view(User $user, Order $order): bool
    {
        return $user->id === $order->user_id || $user->isAdmin() || $this->isAssignedLivreur($user, $order);
    }

    public function cancel(User $user, Order $order): bool
    {
        return $user->id === $order->user_id || $user->isAdmin();
    }

    private function isAssignedLivreur(User $user, Order $order): bool
    {
        if (! $user->isLivreur() || ! $user->deliveryPerson) {
            return false;
        }

        return $order->assignments()->where('delivery_person_id', $user->deliveryPerson->id)->exists();
    }
}
