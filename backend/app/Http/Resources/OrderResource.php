<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Order */
class OrderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'payment_status' => $this->payment_status->value,
            'payment_status_label' => $this->payment_status->label(),
            'user' => $this->when(
                $this->relationLoaded('user'),
                fn () => [
                    'id' => $this->user->id,
                    'full_name' => $this->user->fullName(),
                    'phone' => $this->user->phone,
                    'email' => $this->user->email,
                ]
            ),
            'service' => new ServiceResource($this->whenLoaded('service')),
            'pickup_address' => new AddressResource($this->whenLoaded('pickupAddress')),
            'delivery_address' => new AddressResource($this->whenLoaded('deliveryAddress')),
            'time_slot' => new TimeSlotResource($this->whenLoaded('timeSlot')),
            'pickup_date' => $this->pickup_date?->toDateString(),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'estimated_amount' => (float) $this->estimated_amount,
            'final_amount' => $this->final_amount !== null ? (float) $this->final_amount : null,
            'deposit_amount' => $this->deposit_amount !== null ? (float) $this->deposit_amount : null,
            'notes' => $this->notes,
            'created_at' => $this->created_at,
        ];
    }
}
