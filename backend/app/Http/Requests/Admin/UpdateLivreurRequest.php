<?php

namespace App\Http\Requests\Admin;

use App\Enums\DeliveryPersonStatus;
use App\Rules\ValidPhoneNumber;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateLivreurRequest extends FormRequest
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
        $userId = $this->route('livreur')?->user_id;

        return [
            'first_name' => ['sometimes', 'required', 'string', 'max:100'],
            'last_name' => ['sometimes', 'required', 'string', 'max:100'],
            'phone' => ['sometimes', 'required', 'string', 'max:30', new ValidPhoneNumber, 'unique:users,phone,'.$userId],
            'email' => ['sometimes', 'required', 'email', 'max:255', 'unique:users,email,'.$userId],
            'status' => ['sometimes', new Enum(DeliveryPersonStatus::class)],
        ];
    }
}
