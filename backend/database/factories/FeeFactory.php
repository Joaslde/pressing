<?php

namespace Database\Factories;

use App\Enums\FeeType;
use App\Models\Fee;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Fee> */
class FeeFactory extends Factory
{
    protected $model = Fee::class;

    public function definition(): array
    {
        return [
            'type' => FeeType::Pickup,
            'label' => 'Frais de collecte',
            'amount' => 1000,
            'is_active' => true,
        ];
    }

    public function delivery(): static
    {
        return $this->state(fn () => ['type' => FeeType::Delivery, 'label' => 'Frais de livraison']);
    }
}
