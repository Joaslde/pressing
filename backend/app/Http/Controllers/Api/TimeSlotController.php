<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\TimeSlotResource;
use App\Models\Order;
use App\Models\TimeSlot;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TimeSlotController extends Controller
{
    /**
     * Lists active time slots. When `date` is given, annotates each slot
     * with remaining capacity for that day (cahier §9 - only slots with
     * room left should be offered to the client).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'date' => ['sometimes', 'date'],
        ]);

        $slots = TimeSlot::where('is_active', true)->orderBy('start_time')->get();

        if ($date = $request->query('date')) {
            $bookedCounts = Order::whereDate('pickup_date', $date)
                ->whereNotIn('status', [OrderStatus::Cancelled->value, OrderStatus::Draft->value])
                ->selectRaw('time_slot_id, count(*) as total')
                ->groupBy('time_slot_id')
                ->pluck('total', 'time_slot_id');

            $slots = $slots->map(function (TimeSlot $slot) use ($bookedCounts) {
                $booked = $bookedCounts[$slot->id] ?? 0;
                $slot->remaining_capacity = $slot->max_capacity === null
                    ? null
                    : max(0, $slot->max_capacity - $booked);

                return $slot;
            })->filter(fn (TimeSlot $slot) => $slot->remaining_capacity === null || $slot->remaining_capacity > 0)
                ->values();
        }

        return TimeSlotResource::collection($slots);
    }
}
