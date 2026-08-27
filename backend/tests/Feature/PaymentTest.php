<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Fee;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    config([
        'services.kkiapay.public_key' => 'pub_test',
        'services.kkiapay.private_key' => 'priv_test',
        'services.kkiapay.secret' => 'secret_test',
        'services.kkiapay.sandbox' => true,
    ]);

    Fee::factory()->create(['amount' => 1000]);
    Fee::factory()->delivery()->create(['amount' => 1000]);
});

it('lists kkiapay as available once configured', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->getJson('/api/v1/payments/methods')
        ->assertOk()
        ->assertJson(['methods' => ['kkiapay']]);
});

it('starts a checkout, moves the order to pending_payment and returns widget params', function () {
    $user = User::factory()->create();
    $order = Order::factory()->for($user, 'user')->create([
        'status' => OrderStatus::Draft,
        'estimated_amount' => 9000,
    ]);

    $response = $this->actingAs($user)->postJson("/api/v1/orders/{$order->id}/payments/checkout", [
        'method' => 'kkiapay',
        'amount' => 9000,
    ]);

    $response->assertOk()
        ->assertJsonPath('checkout.mode', 'widget')
        ->assertJsonPath('checkout.public_key', 'pub_test');

    expect($order->fresh()->status)->toBe(OrderStatus::PendingPayment);
    expect($order->fresh()->payment_status)->toBe(PaymentStatus::Pending);
});

it('confirms the order only after server-side verification succeeds, never on client say-so', function () {
    Http::fake([
        'api-sandbox.kkiapay.me/*' => Http::response(['status' => 'SUCCESS', 'amount' => 9000], 200),
    ]);

    $user = User::factory()->create();
    $order = Order::factory()->for($user, 'user')->create([
        'status' => OrderStatus::Draft,
        'estimated_amount' => 9000,
    ]);

    $checkout = $this->actingAs($user)->postJson("/api/v1/orders/{$order->id}/payments/checkout", [
        'method' => 'kkiapay',
        'amount' => 9000,
    ])->json();

    $this->actingAs($user)
        ->postJson("/api/v1/payments/{$checkout['payment_id']}/verify", ['transaction_id' => 'txn_123'])
        ->assertOk()
        ->assertJsonPath('payment.status', 'succeeded');

    $order->refresh();
    expect($order->status)->toBe(OrderStatus::Confirmed);
    expect($order->payment_status)->toBe(PaymentStatus::Paid);
});

it('does not confirm the order when the provider reports a failed transaction', function () {
    Http::fake([
        'api-sandbox.kkiapay.me/*' => Http::response(['status' => 'FAILED'], 200),
    ]);

    $user = User::factory()->create();
    $order = Order::factory()->for($user, 'user')->create(['status' => OrderStatus::Draft, 'estimated_amount' => 9000]);

    $checkout = $this->actingAs($user)->postJson("/api/v1/orders/{$order->id}/payments/checkout", [
        'method' => 'kkiapay',
        'amount' => 9000,
    ])->json();

    $this->actingAs($user)->postJson("/api/v1/payments/{$checkout['payment_id']}/verify", ['transaction_id' => 'txn_bad']);

    $order->refresh();
    expect($order->status)->toBe(OrderStatus::PendingPayment);
    expect($order->payment_status)->toBe(PaymentStatus::Failed);
});
