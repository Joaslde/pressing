<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\MissionType;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignLivreurRequest;
use App\Http\Requests\Admin\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderStatusService;
use DomainException;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrderController extends Controller
{
    public function __construct(private readonly OrderStatusService $orderStatus) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'status' => ['sometimes', 'string'],
            'payment_status' => ['sometimes', 'string'],
            'search' => ['sometimes', 'string'],
        ]);

        $orders = Order::query()
            ->with(['user', 'service', 'timeSlot'])
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('payment_status'), fn ($q, $status) => $q->where('payment_status', $status))
            ->when($request->query('search'), function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('order_number', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($q) => $q->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->paginate(20);

        return OrderResource::collection($orders);
    }

    public function show(Order $order): OrderResource
    {
        return new OrderResource(
            $order->load(['user', 'service', 'pickupAddress', 'deliveryAddress', 'timeSlot', 'items.article', 'payments', 'assignments.deliveryPerson.user'])
        );
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): OrderResource|\Illuminate\Http\JsonResponse
    {
        try {
            $this->orderStatus->transition($order, OrderStatus::from($request->validated('status')));
        } catch (DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return new OrderResource($order->fresh());
    }

    public function assignLivreur(AssignLivreurRequest $request, Order $order): OrderResource|\Illuminate\Http\JsonResponse
    {
        $missionType = MissionType::from($request->validated('mission_type'));

        try {
            $targetStatus = $missionType === MissionType::Pickup ? OrderStatus::PickupScheduled : OrderStatus::DeliveryScheduled;
            $this->orderStatus->transition($order, $targetStatus);
        } catch (DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        $order->assignments()->create([
            'delivery_person_id' => $request->validated('delivery_person_id'),
            'mission_type' => $missionType,
            'status' => 'assigned',
            'assigned_at' => now(),
        ]);

        return new OrderResource($order->fresh(['assignments.deliveryPerson.user']));
    }
}
