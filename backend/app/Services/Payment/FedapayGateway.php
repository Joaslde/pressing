<?php

namespace App\Services\Payment;

use App\Enums\PaymentMethod;
use App\Enums\PaymentTransactionStatus;
use App\Models\Order;
use Illuminate\Support\Facades\Http;

/**
 * FedaPay (https://fedapay.com) uses a server-initiated transaction: create
 * the transaction via API, then redirect the client to the returned
 * `payment_url`. FedaPay confirms completion via webhook AND we re-verify
 * through the API before trusting it.
 */
class FedapayGateway implements PaymentGatewayInterface
{
    public function method(): PaymentMethod
    {
        return PaymentMethod::Fedapay;
    }

    public function isConfigured(): bool
    {
        return filled(config('services.fedapay.public_key')) && filled(config('services.fedapay.secret_key'));
    }

    private function baseUrl(): string
    {
        return config('services.fedapay.sandbox')
            ? 'https://sandbox-api.fedapay.com/v1'
            : 'https://api.fedapay.com/v1';
    }

    public function initiateCheckout(Order $order, float $amount): array
    {
        $response = Http::withToken(config('services.fedapay.secret_key'))
            ->post($this->baseUrl().'/transactions', [
                'description' => "Commande {$order->order_number} - X-Pressing",
                'amount' => (int) round($amount),
                'currency' => ['iso' => 'XOF'],
                'callback_url' => rtrim(config('app.frontend_url'), '/')."/client/orders/{$order->id}",
            ]);

        $transaction = $response->json('v1/transaction') ?? $response->json('transaction') ?? [];

        $tokenResponse = Http::withToken(config('services.fedapay.secret_key'))
            ->post($this->baseUrl()."/transactions/{$transaction['id']}/token");

        return [
            'method' => $this->method()->value,
            'mode' => 'redirect',
            'transaction_id' => $transaction['id'] ?? null,
            'payment_url' => $tokenResponse->json('url'),
        ];
    }

    public function verifyTransaction(string $transactionReference): array
    {
        $response = Http::withToken(config('services.fedapay.secret_key'))
            ->get($this->baseUrl()."/transactions/{$transactionReference}");

        $data = $response->json('v1/transaction') ?? $response->json('transaction') ?? [];
        $providerStatus = strtolower((string) ($data['status'] ?? ''));

        return [
            'status' => match ($providerStatus) {
                'approved' => PaymentTransactionStatus::Succeeded,
                'declined', 'canceled' => PaymentTransactionStatus::Failed,
                'refunded' => PaymentTransactionStatus::Refunded,
                default => PaymentTransactionStatus::Pending,
            },
            'amount' => (float) ($data['amount'] ?? 0),
            'raw' => $data,
        ];
    }
}
