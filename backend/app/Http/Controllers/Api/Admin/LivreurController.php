<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\DeliveryPersonStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLivreurRequest;
use App\Http\Requests\Admin\UpdateLivreurRequest;
use App\Http\Resources\LivreurResource;
use App\Models\DeliveryPerson;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LivreurController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return LivreurResource::collection(DeliveryPerson::with('user')->get());
    }

    /**
     * Creates the livreur's account (cahier §2.1: livreurs never self-register).
     * A temporary password is generated and returned once so the admin can
     * hand it to the livreur - there is no SMS/email provider wired up yet.
     */
    public function store(StoreLivreurRequest $request): JsonResponse
    {
        $temporaryPassword = Str::password(12);

        $deliveryPerson = DB::transaction(function () use ($request, $temporaryPassword) {
            $user = User::create([
                ...$request->validated(),
                'password' => $temporaryPassword,
                'role' => UserRole::Livreur,
                'is_active' => true,
            ]);

            return DeliveryPerson::create([
                'user_id' => $user->id,
                'status' => DeliveryPersonStatus::Available,
            ]);
        });

        return response()->json([
            'livreur' => new LivreurResource($deliveryPerson->load('user')),
            'temporary_password' => $temporaryPassword,
        ], 201);
    }

    public function update(UpdateLivreurRequest $request, DeliveryPerson $livreur): LivreurResource
    {
        $data = $request->validated();

        DB::transaction(function () use ($data, $livreur) {
            $livreur->user->update(array_diff_key($data, ['status' => null]));

            if (isset($data['status'])) {
                $livreur->update(['status' => $data['status']]);
            }
        });

        return new LivreurResource($livreur->fresh('user'));
    }

    public function toggleActive(DeliveryPerson $livreur): LivreurResource
    {
        $livreur->user->update(['is_active' => ! $livreur->user->is_active]);

        return new LivreurResource($livreur->fresh('user'));
    }
}
