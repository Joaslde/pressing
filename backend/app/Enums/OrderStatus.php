<?php

namespace App\Enums;

/**
 * Mirrors the order lifecycle from the cahier des charges §13.
 * Keys are internal (English, stable); labels are the French text shown to users.
 */
enum OrderStatus: string
{
    case Draft = 'draft';
    case PendingPayment = 'pending_payment';
    case Confirmed = 'confirmed';
    case PickupScheduled = 'pickup_scheduled';
    case PickedUp = 'picked_up';
    case Processing = 'processing';
    case Ready = 'ready';
    case AwaitingBalance = 'awaiting_balance';
    case DeliveryScheduled = 'delivery_scheduled';
    case OutForDelivery = 'out_for_delivery';
    case Delivered = 'delivered';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Brouillon',
            self::PendingPayment => 'En attente de paiement',
            self::Confirmed => 'Confirmée',
            self::PickupScheduled => 'Collecte planifiée',
            self::PickedUp => 'Collectée',
            self::Processing => 'En traitement',
            self::Ready => 'Prête',
            self::AwaitingBalance => 'En attente du solde',
            self::DeliveryScheduled => 'Livraison planifiée',
            self::OutForDelivery => 'En livraison',
            self::Delivered => 'Livrée',
            self::Completed => 'Terminée',
            self::Cancelled => 'Annulée',
        };
    }

    /**
     * Allowed forward transitions. Enforced by OrderStatusService so state
     * changes always follow the cahier's order lifecycle (§13).
     *
     * @return list<self>
     */
    public function allowedNextStatuses(): array
    {
        return match ($this) {
            self::Draft => [self::PendingPayment, self::Cancelled],
            self::PendingPayment => [self::Confirmed, self::Cancelled],
            self::Confirmed => [self::PickupScheduled, self::Cancelled],
            self::PickupScheduled => [self::PickedUp, self::Cancelled],
            self::PickedUp => [self::Processing, self::Cancelled],
            self::Processing => [self::Ready, self::Cancelled],
            self::Ready => [self::AwaitingBalance, self::DeliveryScheduled, self::Cancelled],
            self::AwaitingBalance => [self::DeliveryScheduled, self::Cancelled],
            self::DeliveryScheduled => [self::OutForDelivery, self::Cancelled],
            self::OutForDelivery => [self::Delivered, self::Cancelled],
            self::Delivered => [self::Completed],
            self::Completed, self::Cancelled => [],
        };
    }

    public function canTransitionTo(self $next): bool
    {
        return in_array($next, $this->allowedNextStatuses(), true);
    }
}
