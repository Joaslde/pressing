<?php

namespace App\Http\Controllers\Api;

use App\Enums\PaymentMethod;
use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\CheckoutRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Order;
use App\Models\Payment;
use App\Services\PaymentService;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private readonly PaymentService $payments) {}

    public function methods(): JsonResponse
    {
        return response()->json(['methods' => $this->payments->availableMethods()]);
    }

    public function checkout(CheckoutRequest $request, Order $order): JsonResponse
    {
        $this->authorize('view', $order);

        try {
            $result = $this->payments->checkout(
                $order,
                PaymentMethod::from($request->validated('method')),
                (float) $request->validated('amount'),
            );
        } catch (DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json($result);
    }

    /**
     * Called by the frontend right after the Kkiapay widget reports success,
     * carrying the provider's transaction id. We re-verify server-side
     * before trusting it (see PaymentService::verify).
     */
    public function verify(Request $request, Payment $payment): JsonResponse
    {
        $this->authorize('view', $payment->order);

        $request->validate(['transaction_id' => ['sometimes', 'string']]);

        $payment = $this->payments->verify($payment, $request->input('transaction_id'));

        return response()->json(['payment' => new PaymentResource($payment)]);
    }
}
