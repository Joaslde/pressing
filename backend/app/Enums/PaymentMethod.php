<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Kkiapay = 'kkiapay';
    case Fedapay = 'fedapay';

    public function label(): string
    {
        return match ($this) {
            self::Kkiapay => 'Kkiapay',
            self::Fedapay => 'FedaPay',
        };
    }
}
