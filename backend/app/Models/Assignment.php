<?php

namespace App\Models;

use App\Enums\AssignmentStatus;
use App\Enums\MissionType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'delivery_person_id',
        'mission_type',
        'status',
        'assigned_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'mission_type' => MissionType::class,
            'status' => AssignmentStatus::class,
            'assigned_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function deliveryPerson(): BelongsTo
    {
        return $this->belongsTo(DeliveryPerson::class);
    }
}
