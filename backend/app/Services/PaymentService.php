<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\PaymentTransactionStatus;
use App\Models\Order;
use App\Models\Payment;
use App\Services\Payment\PaymentGatewayFactory;
use DomainException;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function __construct(
        private readonly PaymentGatewayFactory $gateways,
        private readonly OrderStatusService $orderStatus,
    ) {}

    /**
     * @return array<int, string>
     */
    public function availableMethods(): array
    {
        return array_map(fn ($gateway) => $gateway->method()->value, $this->gateways->configured());
    }

    /**
     * Creates a pending Payment for the order and returns the gateway's
     * checkout payload (widget params or redirect URL) for the frontend.
     *
     * @return array{payment_id: int, checkout: array<string, mixed>}
     */
    public function checkout(Order $order, PaymentMethod $method, float $amount): array
    {
        if ($amount <= 0 || $amount > (float) $order->estimated_amount) {
            throw new DomainException('Montant de paiement invalide.');
        }

        $gateway = $this->gateways->make($method);

        if (! $gateway->isConfigured()) {
            throw new DomainException("Le moyen de paiement {$method->label()} n'est pas disponible.");
        }

        return DB::transaction(function () use ($order, $method, $amount, $gateway) {
            $payment = Payment::create([
                'order_id' => $order->id,
                'amount' => $amount,
                'method' => $method,
                'status' => PaymentTransactionStatus::Pending,
            ]);

            if ($order->status === OrderStatus::Draft) {
                $this->orderStatus->transition($order, OrderStatus::PendingPayment);
            }

            $order->update(['payment_status' => PaymentStatus::Pending]);

            $checkoutPayload = $gateway->initiateCheckout($order, $amount);

            if (isset($checkoutPayload['transaction_id'])) {
                $payment->update(['transaction_reference' => (string) $checkoutPayload['transaction_id']]);
            } else {
                // Kkiapay: the client-side widget generates the transaction id;
                // we key on the order number until verify() supplies the real one.
                $payment->update(['transaction_reference' => $order->order_number]);
            }

            return ['payment_id' => $payment->id, 'checkout' => $checkoutPayload];
        });
    }

    /**
     * Re-verifies a payment against the provider's API (never trusts a
     * client-reported status) and applies the result to Payment + Order.
     */
    public function verify(Payment $payment, ?string $providerTransactionId = null): Payment
    {
        $gateway = $this->gateways->make($payment->method);
        $reference = $providerTransactionId ?? $payment->transaction_reference;

        $result = $gateway->verifyTransaction($reference);

        return DB::transaction(function () use ($payment, $result, $reference) {
            $payment->update([
                'transaction_reference' => $reference,
                'status' => $result['status'],
                'raw_response' => $result['raw'],
                'paid_at' => $result['status'] === PaymentTransactionStatus::Succeeded ? now() : null,
            ]);

            $this->applyToOrder($payment->order, $payment);

            return $payment->fresh();
        });
    }

    private function applyToOrder(Order $order, Payment $payment): void
    {
        if ($payment->status !== PaymentTransactionStatus::Succeeded) {
            if ($payment->status === PaymentTransactionStatus::Failed) {
                $order->update(['payment_status' => PaymentStatus::Failed]);
            }

            return;
        }

        $totalPaid = (float) $order->payments()->where('status', PaymentTransactionStatus::Succeeded)->sum('amount');
        $isFullyPaid = $totalPaid >= (float) $order->estimated_amount;

        $order->update([
            'payment_status' => $isFullyPaid ? PaymentStatus::Paid : PaymentStatus::DepositPaid,
            'deposit_amount' => $isFullyPaid ? $order->deposit_amount : $totalPaid,
        ]);

        if ($order->status === OrderStatus::PendingPayment) {
            $this->orderStatus->transition($order, OrderStatus::Confirmed);
        }
    }
}
