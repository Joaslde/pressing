<?php

use App\Enums\UserRole;
use App\Models\Article;
use App\Models\Fee;
use App\Models\Order;
use App\Models\Service;
use App\Models\TimeSlot;
use App\Models\User;

beforeEach(function () {
    Fee::factory()->create(['amount' => 1000]);
    Fee::factory()->delivery()->create(['amount' => 1000]);
});

it('computes the order total exactly like the cahier example (§10)', function () {
    $user = User::factory()->create();
    $address = \App\Models\Address::factory()->for($user)->create();
    $service = Service::factory()->create();
    $slot = TimeSlot::factory()->create();
    $chemise = Article::factory()->create(['price' => 1000]);
    $pantalon = Article::factory()->create(['price' => 1500]);

    $response = $this->actingAs($user)->postJson('/api/v1/orders', [
        'service_id' => $service->id,
        'pickup_address_id' => $address->id,
        'delivery_address_id' => $address->id,
        'pickup_date' => now()->addDay()->toDateString(),
        'time_slot_id' => $slot->id,
        'items' => [
            ['article_id' => $chemise->id, 'quantity' => 4],
            ['article_id' => $pantalon->id, 'quantity' => 2],
        ],
    ]);

    // 4x1000 + 2x1500 = 7000, + 1000 pickup + 1000 delivery = 9000
    $response->assertCreated()->assertJsonPath('data.estimated_amount', 9000);
});

it('rejects an address that does not belong to the authenticated user', function () {
    $user = User::factory()->create();
    $otherUsersAddress = \App\Models\Address::factory()->create();
    $service = Service::factory()->create();
    $slot = TimeSlot::factory()->create();
    $article = Article::factory()->create();

    $this->actingAs($user)->postJson('/api/v1/orders', [
        'service_id' => $service->id,
        'pickup_address_id' => $otherUsersAddress->id,
        'delivery_address_id' => $otherUsersAddress->id,
        'pickup_date' => now()->addDay()->toDateString(),
        'time_slot_id' => $slot->id,
        'items' => [['article_id' => $article->id, 'quantity' => 1]],
    ])->assertUnprocessable();
});

it('prevents a client from viewing another client\'s order', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $order = Order::factory()->for($owner, 'user')->create();

    $this->actingAs($intruder)->getJson("/api/v1/orders/{$order->id}")->assertForbidden();
});

it('lets an admin view any order', function () {
    $owner = User::factory()->create();
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $order = Order::factory()->for($owner, 'user')->create();

    $this->actingAs($admin)->getJson("/api/v1/orders/{$order->id}")->assertOk();
});
