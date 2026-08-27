<?php

namespace App\Http\Controllers\Api\Livreur;

use App\Enums\MissionType;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $deliveryPerson = $request->user()->deliveryPerson;

        if (! $deliveryPerson) {
            return response()->json(['message' => 'Profil livreur introuvable.'], 404);
        }

        $assignments = $deliveryPerson->assignments()->with('order');

        return response()->json([
            'pickups_today' => (clone $assignments)
                ->where('mission_type', MissionType::Pickup)
                ->whereHas('order', fn ($q) => $q->whereDate('pickup_date', today()))
                ->count(),
            'deliveries_today' => (clone $assignments)
                ->where('mission_type', MissionType::Delivery)
                ->whereHas('order', fn ($q) => $q->whereDate('pickup_date', today()))
                ->count(),
            'total_assigned' => (clone $assignments)->whereIn('status', ['assigned', 'confirmed'])->count(),
        ]);
    }
}
