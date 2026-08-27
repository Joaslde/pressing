<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\OrderItem */
class OrderItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'article_id' => $this->article_id,
            'article_name' => $this->article->name,
            'quantity' => $this->quantity,
            'unit_price' => (float) $this->unit_price,
            'subtotal' => (float) $this->subtotal,
        ];
    }
}
