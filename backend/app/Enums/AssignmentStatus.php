<?php

namespace App\Enums;

enum AssignmentStatus: string
{
    case Assigned = 'assigned';
    case Confirmed = 'confirmed';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Assigned => 'Affectée',
            self::Confirmed => 'Confirmée',
            self::Completed => 'Terminée',
            self::Cancelled => 'Annulée',
        };
    }
}
