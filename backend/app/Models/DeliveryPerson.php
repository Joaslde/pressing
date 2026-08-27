<?php

namespace App\Models;

use App\Enums\DeliveryPersonStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeliveryPerson extends Model
{
    use HasFactory;

    protected $table = 'delivery_persons';

    protected $fillable = [
        'user_id',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => DeliveryPersonStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(Assignment::class);
    }
}
