<?php

namespace Database\Factories;

use App\Models\TimeSlot;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<TimeSlot> */
class TimeSlotFactory extends Factory
{
    protected $model = TimeSlot::class;

    public function definition(): array
    {
        return [
            'label' => '08h - 10h',
            'start_time' => '08:00',
            'end_time' => '10:00',
            'max_capacity' => 10,
            'is_active' => true,
        ];
    }
}
