<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\TimeSlot */
class TimeSlotResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'start_time' => substr((string) $this->start_time, 0, 5),
            'end_time' => substr((string) $this->end_time, 0, 5),
            'max_capacity' => $this->max_capacity,
            'remaining_capacity' => $this->when(isset($this->remaining_capacity), fn () => $this->remaining_capacity),
            'is_active' => $this->is_active,
        ];
    }
}
