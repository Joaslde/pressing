<?php

namespace App\Http\Requests\Admin;

use App\Enums\MissionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class AssignLivreurRequest extends FormRequest
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
            'delivery_person_id' => ['required', 'integer', 'exists:delivery_persons,id'],
            'mission_type' => ['required', new Enum(MissionType::class)],
        ];
    }
}
