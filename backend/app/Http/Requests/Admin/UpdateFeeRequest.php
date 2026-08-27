<?php

namespace App\Http\Requests\Admin;

use App\Enums\FeeType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateFeeRequest extends FormRequest
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
            'type' => ['sometimes', 'required', new Enum(FeeType::class)],
            'label' => ['sometimes', 'required', 'string', 'max:150'],
            'amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
