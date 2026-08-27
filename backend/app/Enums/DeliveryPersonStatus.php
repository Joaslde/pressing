<?php

namespace App\Enums;

enum DeliveryPersonStatus: string
{
    case Available = 'available';
    case Busy = 'busy';
    case Inactive = 'inactive';

    public function label(): string
    {
        return match ($this) {
            self::Available => 'Disponible',
            self::Busy => 'Occupé',
            self::Inactive => 'Inactif',
        };
    }
}
