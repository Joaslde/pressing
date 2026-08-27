<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Service> */
class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->sentence(),
            'treatment_type' => fake()->randomElement(['hand_wash', 'wash_and_iron', 'iron_only', 'dry_clean']),
            'is_active' => true,
        ];
    }
}
