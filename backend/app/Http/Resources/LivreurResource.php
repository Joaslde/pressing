<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\DeliveryPerson */
class LivreurResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'first_name' => $this->user->first_name,
            'last_name' => $this->user->last_name,
            'full_name' => $this->user->fullName(),
            'phone' => $this->user->phone,
            'email' => $this->user->email,
            'is_active' => $this->user->is_active,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
        ];
    }
}
