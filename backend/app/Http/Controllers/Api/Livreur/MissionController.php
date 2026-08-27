<?php

namespace App\Http\Controllers\Api\Livreur;

use App\Enums\AssignmentStatus;
use App\Enums\MissionType;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\AssignmentResource;
use App\Models\Assignment;
use App\Services\OrderStatusService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MissionController extends Controller
{
    public function __construct(private readonly OrderStatusService $orderStatus) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $deliveryPerson = $request->user()->deliveryPerson;

        $request->validate([
            'mission_type' => ['sometimes', 'in:pickup,delivery'],
            'status' => ['sometimes', 'in:assigned,confirmed,completed,cancelled'],
        ]);

        $query = $deliveryPerson
            ? $deliveryPerson->assignments()->with(['order.timeSlot', 'order.pickupAddress', 'order.deliveryAddress', 'order.user'])
            : Assignment::query()->whereRaw('0 = 1');

        $query->when($request->query('mission_type'), fn ($q, $type) => $q->where('mission_type', $type))
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status));

        return AssignmentResource::collection($query->latest('assigned_at')->get());
    }

    public function confirm(Assignment $assignment): AssignmentResource
    {
        $this->authorize('update', $assignment);

        if ($assignment->status === AssignmentStatus::Completed) {
            abort(422, 'Cette mission est déjà terminée.');
        }

        $order = $assignment->order;

        if ($assignment->mission_type === MissionType::Pickup) {
            $this->orderStatus->transition($order, OrderStatus::PickedUp);
        } else {
            if ($order->status === OrderStatus::DeliveryScheduled) {
                $this->orderStatus->transition($order, OrderStatus::OutForDelivery);
            }
            $this->orderStatus->transition($order->fresh(), OrderStatus::Delivered);
        }

        $assignment->update([
            'status' => AssignmentStatus::Completed,
            'completed_at' => now(),
        ]);

        return new AssignmentResource($assignment->fresh('order'));
    }
}
