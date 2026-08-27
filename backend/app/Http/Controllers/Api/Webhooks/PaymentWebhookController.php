<?php

namespace App\Http\Controllers\Api\Webhooks;

use App\Enums\PaymentMethod;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Gateway webhooks only ever act as a trigger to re-check a transaction -
 * PaymentService::verify() always re-queries the provider's API before
 * updating anything, so a forged webhook body cannot fake a payment.
 */
class PaymentWebhookController extends Controller
{
    public function __construct(private readonly PaymentService $payments) {}

    public function kkiapay(Request $request): JsonResponse
    {
        return $this->handle($request, PaymentMethod::Kkiapay, $request->input('transactionId') ?? $request->input('data.transactionId'));
    }

    public function fedapay(Request $request): JsonResponse
    {
        $transactionId = $request->input('entity.id') ?? $request->input('data.object.id');

        return $this->handle($request, PaymentMethod::Fedapay, $transactionId ? (string) $transactionId : null);
    }

    private function handle(Request $request, PaymentMethod $method, ?string $transactionId): JsonResponse
    {
        if (! $transactionId) {
            Log::warning('Payment webhook received without a transaction id', ['method' => $method->value]);

            return response()->json(['message' => 'Payload invalide.'], 422);
        }

        $payment = Payment::where('method', $method)
            ->where('transaction_reference', $transactionId)
            ->latest()
            ->first();

        if (! $payment) {
            Log::info('Payment webhook for unknown transaction, ignoring', [
                'method' => $method->value,
                'transaction_id' => $transactionId,
            ]);

            return response()->json(['message' => 'Transaction inconnue.'], 200);
        }

        $this->payments->verify($payment, $transactionId);

        return response()->json(['message' => 'ok']);
    }
}
