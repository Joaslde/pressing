<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Assignment */
class AssignmentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var \App\Models\Order $order */
        $order = $this->order;

        return [
            'id' => $this->id,
            'mission_type' => $this->mission_type->value,
            'mission_type_label' => $this->mission_type->label(),
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'assigned_at' => $this->assigned_at,
            'completed_at' => $this->completed_at,
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'pickup_date' => $order->pickup_date?->toDateString(),
                'time_slot' => new TimeSlotResource($order->timeSlot),
                'address' => new AddressResource(
                    $this->mission_type->value === 'pickup' ? $order->pickupAddress : $order->deliveryAddress
                ),
                'client' => [
                    'full_name' => $order->user->fullName(),
                    'phone' => $order->user->phone,
                ],
            ],
        ];
    }
}
