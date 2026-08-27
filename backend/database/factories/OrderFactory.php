<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Address;
use App\Models\Order;
use App\Models\Service;
use App\Models\TimeSlot;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Order> */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $user = User::factory();

        return [
            'order_number' => 'XP-'.now()->format('Ymd').'-'.strtoupper(Str::random(5)),
            'user_id' => $user,
            'service_id' => Service::factory(),
            'pickup_address_id' => Address::factory()->for($user, 'user'),
            'delivery_address_id' => Address::factory()->for($user, 'user'),
            'pickup_date' => now()->addDay()->toDateString(),
            'time_slot_id' => TimeSlot::factory(),
            'estimated_amount' => 9000,
            'status' => OrderStatus::Draft,
            'payment_status' => PaymentStatus::Unpaid,
        ];
    }
}
