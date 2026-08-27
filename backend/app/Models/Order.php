<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'service_id',
        'pickup_address_id',
        'delivery_address_id',
        'pickup_date',
        'time_slot_id',
        'estimated_amount',
        'final_amount',
        'deposit_amount',
        'status',
        'payment_status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'pickup_date' => 'date',
            'estimated_amount' => 'decimal:2',
            'final_amount' => 'decimal:2',
            'deposit_amount' => 'decimal:2',
            'status' => OrderStatus::class,
            'payment_status' => PaymentStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function pickupAddress(): BelongsTo
    {
        return $this->belongsTo(Address::class, 'pickup_address_id');
    }

    public function deliveryAddress(): BelongsTo
    {
        return $this->belongsTo(Address::class, 'delivery_address_id');
    }

    public function timeSlot(): BelongsTo
    {
        return $this->belongsTo(TimeSlot::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(Assignment::class);
    }
}
