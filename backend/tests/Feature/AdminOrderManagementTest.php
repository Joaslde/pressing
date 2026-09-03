<?php

use App\Enums\DeliveryPersonStatus;
use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\DeliveryPerson;
use App\Models\Order;
use App\Models\User;

it('explains in plain language why a livreur cannot be assigned yet', function () {
    // Regression test: this used to surface a raw "pending_payment -> picked_up"
    // style technical string straight from the DomainException.
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $livreurUser = User::factory()->create(['role' => UserRole::Livreur]);
    $deliveryPerson = DeliveryPerson::create([
        'user_id' => $livreurUser->id,
        'status' => DeliveryPersonStatus::Available,
    ]);
    // Draft can't go straight to pickup_scheduled - only Confirmed can.
    $order = Order::factory()->create(['status' => OrderStatus::Draft]);

    $response = $this->actingAs($admin)->postJson("/api/v1/admin/orders/{$order->id}/assign", [
        'delivery_person_id' => $deliveryPerson->id,
        'mission_type' => 'pickup',
    ]);

    $response->assertUnprocessable();
    $message = $response->json('message');

    expect($message)
        ->toContain('Collecte planifiée') // target status, in French
        ->toContain('Brouillon') // current status, in French
        ->toContain('Confirmée') // what it needs to be instead
        ->not->toContain('draft') // no raw enum values leaking through
        ->not->toContain('pickup_scheduled');
});

it('assigns a livreur once the order is in a valid status', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $livreurUser = User::factory()->create(['role' => UserRole::Livreur]);
    $deliveryPerson = DeliveryPerson::create([
        'user_id' => $livreurUser->id,
        'status' => DeliveryPersonStatus::Available,
    ]);
    $order = Order::factory()->create(['status' => OrderStatus::Confirmed]);

    $this->actingAs($admin)->postJson("/api/v1/admin/orders/{$order->id}/assign", [
        'delivery_person_id' => $deliveryPerson->id,
        'mission_type' => 'pickup',
    ])->assertOk();

    expect($order->fresh()->status)->toBe(OrderStatus::PickupScheduled);
});

it('returns a client\'s order history in the shape the frontend expects', function () {
    // Regression test: `orders` used to be a bare array instead of
    // {"data": [...]} like the paginated list endpoints, which crashed the
    // admin client detail page (`orders.data` was undefined).
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $client = User::factory()->create(['role' => UserRole::Client]);
    Order::factory()->for($client, 'user')->create();

    $this->actingAs($admin)->getJson("/api/v1/admin/clients/{$client->id}")
        ->assertOk()
        ->assertJsonStructure(['client', 'orders' => ['data']])
        ->assertJsonCount(1, 'orders.data');
});
