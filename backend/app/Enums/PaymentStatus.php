<?php

namespace App\Enums;

/**
 * Order-level aggregate payment status (cahier §11.2). Distinct from
 * PaymentTransactionStatus, which tracks a single Payment record's outcome.
 */
enum PaymentStatus: string
{
    case Unpaid = 'unpaid';
    case Pending = 'pending';
    case DepositPaid = 'deposit_paid';
    case Paid = 'paid';
    case Failed = 'failed';
    case Refunded = 'refunded';

    public function label(): string
    {
        return match ($this) {
            self::Unpaid => 'Non payé',
            self::Pending => 'Paiement en attente',
            self::DepositPaid => 'Acompte payé',
            self::Paid => 'Payé intégralement',
            self::Failed => 'Échec',
            self::Refunded => 'Remboursé',
        };
    }
}
