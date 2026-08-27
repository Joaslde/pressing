<?php

namespace App\Services\Payment;

use App\Enums\PaymentMethod;

class PaymentGatewayFactory
{
    public function __construct(
        private readonly KkiapayGateway $kkiapay,
        private readonly FedapayGateway $fedapay,
    ) {}

    public function make(PaymentMethod $method): PaymentGatewayInterface
    {
        return match ($method) {
            PaymentMethod::Kkiapay => $this->kkiapay,
            PaymentMethod::Fedapay => $this->fedapay,
        };
    }

    /**
     * @return array<int, PaymentGatewayInterface>
     */
    public function configured(): array
    {
        return array_values(array_filter(
            [$this->kkiapay, $this->fedapay],
            fn (PaymentGatewayInterface $gateway) => $gateway->isConfigured(),
        ));
    }
}
