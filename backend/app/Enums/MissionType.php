<?php

namespace App\Enums;

enum MissionType: string
{
    case Pickup = 'pickup';
    case Delivery = 'delivery';

    public function label(): string
    {
        return match ($this) {
            self::Pickup => 'Collecte',
            self::Delivery => 'Livraison',
        };
    }
}
