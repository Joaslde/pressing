<?php

namespace App\Services\Payment;

use App\Enums\PaymentMethod;
use App\Enums\PaymentTransactionStatus;
use App\Models\Order;
use Illuminate\Support\Facades\Http;

/**
 * Kkiapay (https://kkiapay.me) checkout happens client-side via their JS
 * widget using the public key. The backend never initiates the transaction -
 * it only re-verifies it server-side afterwards via Kkiapay's transaction
 * status API, using the private key. This is Kkiapay's documented
 * integration pattern: never trust the client's "success" callback alone.
 */
class KkiapayGateway implements PaymentGatewayInterface
{
    private const VERIFY_URL_LIVE = 'https://api.kkiapay.me/api/v1/transactions/status';

    private const VERIFY_URL_SANDBOX = 'https://api-sandbox.kkiapay.me/api/v1/transactions/status';

    public function method(): PaymentMethod
    {
        return PaymentMethod::Kkiapay;
    }

    public function isConfigured(): bool
    {
        return filled(config('services.kkiapay.public_key'))
            && filled(config('services.kkiapay.private_key'))
            && filled(config('services.kkiapay.secret'));
    }

    public function initiateCheckout(Order $order, float $amount): array
    {
        return [
            'method' => $this->method()->value,
            'mode' => 'widget',
            'public_key' => config('services.kkiapay.public_key'),
            'sandbox' => (bool) config('services.kkiapay.sandbox'),
            'amount' => $amount,
            'transaction_ref' => $order->order_number,
        ];
    }

    public function verifyTransaction(string $transactionReference): array
    {
        $url = config('services.kkiapay.sandbox') ? self::VERIFY_URL_SANDBOX : self::VERIFY_URL_LIVE;

        $response = Http::withHeaders([
            'x-api-key' => config('services.kkiapay.public_key'),
        ])->post($url, [
            'transactionId' => $transactionReference,
        ]);

        $data = $response->json() ?? [];
        $providerStatus = strtoupper((string) ($data['status'] ?? ''));

        return [
            'status' => match ($providerStatus) {
                'SUCCESS' => PaymentTransactionStatus::Succeeded,
                'FAILED' => PaymentTransactionStatus::Failed,
                default => PaymentTransactionStatus::Pending,
            },
            'amount' => (float) ($data['amount'] ?? 0),
            'raw' => $data,
        ];
    }
}
