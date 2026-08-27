<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Address */
class AddressResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'full_address' => $this->full_address,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'city' => $this->city,
            'district' => $this->district,
            'instructions' => $this->instructions,
            'is_default' => $this->is_default,
        ];
    }
}
