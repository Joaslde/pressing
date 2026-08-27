<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Address> */
class AddressFactory extends Factory
{
    protected $model = Address::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'label' => 'Domicile',
            'full_address' => fake()->address(),
            'city' => 'Cotonou',
            'is_default' => true,
        ];
    }
}
