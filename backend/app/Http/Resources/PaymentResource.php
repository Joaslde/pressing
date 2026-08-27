<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Payment */
class PaymentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'amount' => (float) $this->amount,
            'method' => $this->method->value,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'paid_at' => $this->paid_at,
        ];
    }
}
