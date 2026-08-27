<?php

namespace App\Services\Payment;

use App\Enums\PaymentMethod;
use App\Enums\PaymentTransactionStatus;
use App\Models\Order;

interface PaymentGatewayInterface
{
    public function method(): PaymentMethod;

    /**
     * Whether this gateway has usable credentials configured (.env). Used to
     * hide the option from clients until an admin fills in real keys.
     */
    public function isConfigured(): bool;

    /**
     * Starts a checkout for the given order/amount and returns whatever the
     * frontend needs to complete payment (widget params, redirect URL, ...).
     *
     * @return array<string, mixed>
     */
    public function initiateCheckout(Order $order, float $amount): array;

    /**
     * Asks the provider's API to confirm a transaction's real status. Never
     * trust a client-reported "success" - always re-verify server-side.
     *
     * @return array{status: PaymentTransactionStatus, amount: float, raw: array<string, mixed>}
     */
    public function verifyTransaction(string $transactionReference): array;
}
