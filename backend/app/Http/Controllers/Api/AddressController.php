<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Address\StoreAddressRequest;
use App\Http\Requests\Address\UpdateAddressRequest;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        return AddressResource::collection(
            $request->user()->addresses()->latest()->get()
        );
    }

    public function store(StoreAddressRequest $request): AddressResource
    {
        $address = DB::transaction(function () use ($request) {
            $data = $request->validated();

            if ($data['is_default'] ?? false) {
                $request->user()->addresses()->update(['is_default' => false]);
            }

            return $request->user()->addresses()->create($data);
        });

        return new AddressResource($address);
    }

    public function update(UpdateAddressRequest $request, Address $address): AddressResource
    {
        $this->authorize('update', $address);

        DB::transaction(function () use ($request, $address) {
            $data = $request->validated();

            if ($data['is_default'] ?? false) {
                $address->user->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
            }

            $address->update($data);
        });

        return new AddressResource($address->fresh());
    }

    public function destroy(Address $address): \Illuminate\Http\Response
    {
        $this->authorize('delete', $address);

        $address->delete();

        return response()->noContent();
    }
}
