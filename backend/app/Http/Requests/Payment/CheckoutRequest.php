<?php

namespace App\Http\Requests\Payment;

use App\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class CheckoutRequest extends FormRequest
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
            'method' => ['required', new Enum(PaymentMethod::class)],
            'amount' => ['required', 'numeric', 'min:1'],
        ];
    }
}
