<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Address;
use App\Models\Order;
use App\Models\TimeSlot;
use App\Services\OrderPricingService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function __construct(private readonly OrderPricingService $pricing) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $orders = $request->user()->orders()
            ->with(['service', 'timeSlot'])
            ->latest()
            ->paginate(15);

        return OrderResource::collection($orders);
    }

    public function store(StoreOrderRequest $request): OrderResource
    {
        $data = $request->validated();
        $user = $request->user();

        $this->assertAddressBelongsToUser($data['pickup_address_id'], $user->id);
        $this->assertAddressBelongsToUser($data['delivery_address_id'], $user->id);
        $this->assertSlotHasCapacity($data['time_slot_id'], $data['pickup_date']);

        $breakdown = $this->pricing->calculate($data['items']);

        $order = DB::transaction(function () use ($data, $user, $breakdown) {
            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'user_id' => $user->id,
                'service_id' => $data['service_id'],
                'pickup_address_id' => $data['pickup_address_id'],
                'delivery_address_id' => $data['delivery_address_id'],
                'pickup_date' => $data['pickup_date'],
                'time_slot_id' => $data['time_slot_id'],
                'estimated_amount' => $breakdown['total'],
                'status' => OrderStatus::Draft,
                'payment_status' => PaymentStatus::Unpaid,
                'notes' => $data['notes'] ?? null,
            ]);

            $order->items()->createMany($breakdown['items']->map(fn (array $line) => [
                'article_id' => $line['article_id'],
                'quantity' => $line['quantity'],
                'unit_price' => $line['unit_price'],
                'subtotal' => $line['subtotal'],
            ])->all());

            return $order;
        });

        return new OrderResource($order->load(['service', 'pickupAddress', 'deliveryAddress', 'timeSlot', 'items.article']));
    }

    public function show(Order $order): OrderResource
    {
        $this->authorize('view', $order);

        return new OrderResource(
            $order->load(['service', 'pickupAddress', 'deliveryAddress', 'timeSlot', 'items.article', 'payments'])
        );
    }

    private function assertAddressBelongsToUser(int $addressId, int $userId): void
    {
        $exists = Address::where('id', $addressId)->where('user_id', $userId)->exists();

        if (! $exists) {
            throw ValidationException::withMessages(['pickup_address_id' => ["Adresse invalide."]]);
        }
    }

    private function assertSlotHasCapacity(int $timeSlotId, string $pickupDate): void
    {
        $slot = TimeSlot::findOrFail($timeSlotId);

        if ($slot->max_capacity === null) {
            return;
        }

        $booked = Order::whereDate('pickup_date', $pickupDate)
            ->where('time_slot_id', $timeSlotId)
            ->whereNotIn('status', [OrderStatus::Cancelled->value, OrderStatus::Draft->value])
            ->count();

        if ($booked >= $slot->max_capacity) {
            throw ValidationException::withMessages(['time_slot_id' => ["Ce créneau est complet pour cette date."]]);
        }
    }

    private function generateOrderNumber(): string
    {
        do {
            $candidate = 'XP-'.now()->format('Ymd').'-'.strtoupper(Str::random(5));
        } while (Order::where('order_number', $candidate)->exists());

        return $candidate;
    }
}
