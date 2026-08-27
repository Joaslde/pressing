<?php

namespace App\Enums;

enum UserRole: string
{
    case Client = 'client';
    case Livreur = 'livreur';
    case Admin = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::Client => 'Client',
            self::Livreur => 'Livreur',
            self::Admin => 'Administrateur',
        };
    }
}
