<?php

namespace App\Models;

use App\Enums\FeeType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fee extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'label',
        'amount',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'type' => FeeType::class,
            'amount' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }
}
