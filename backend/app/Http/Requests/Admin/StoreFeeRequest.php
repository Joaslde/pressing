<?php

namespace App\Http\Requests\Admin;

use App\Enums\FeeType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreFeeRequest extends FormRequest
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
            'type' => ['required', new Enum(FeeType::class)],
            'label' => ['required', 'string', 'max:150'],
            'amount' => ['required', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
