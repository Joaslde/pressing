<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'pickup_address_id' => ['required', 'integer', 'exists:addresses,id'],
            'delivery_address_id' => ['required', 'integer', 'exists:addresses,id'],
            'pickup_date' => ['required', 'date', 'after_or_equal:today'],
            'time_slot_id' => ['required', 'integer', 'exists:time_slots,id'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.article_id' => ['required', 'integer', 'exists:articles,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:100'],
        ];
    }
}
