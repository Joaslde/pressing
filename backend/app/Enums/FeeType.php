<?php

namespace App\Enums;

enum FeeType: string
{
    case Pickup = 'pickup';
    case Delivery = 'delivery';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Pickup => 'Frais de collecte',
            self::Delivery => 'Frais de livraison',
            self::Other => 'Autres frais',
        };
    }
}
