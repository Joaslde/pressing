<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ClientController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $clients = User::where('role', UserRole::Client)
            ->when($request->query('search'), fn ($q, $search) => $q->where(fn ($q) => $q
                ->where('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")))
            ->withCount('orders')
            ->latest()
            ->paginate(20);

        return UserResource::collection($clients);
    }

    public function show(User $client): \Illuminate\Http\JsonResponse
    {
        abort_unless($client->role === UserRole::Client, 404);

        return response()->json([
            'client' => new UserResource($client),
            // Explicitly wrapped in `data` - this isn't paginated, so Laravel's
            // resource collection doesn't apply its usual auto-wrapping here,
            // and the frontend expects `orders.data` consistently with the
            // paginated list endpoints.
            'orders' => [
                'data' => OrderResource::collection(
                    $client->orders()->with(['service', 'timeSlot'])->latest()->get()
                ),
            ],
        ]);
    }

    public function toggleActive(User $client): UserResource
    {
        abort_unless($client->role === UserRole::Client, 404);

        $client->update(['is_active' => ! $client->is_active]);

        return new UserResource($client);
    }
}
