<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreFeeRequest;
use App\Http\Requests\Admin\UpdateFeeRequest;
use App\Http\Resources\FeeResource;
use App\Models\Fee;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

class FeeController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return FeeResource::collection(Fee::orderBy('type')->get());
    }

    public function store(StoreFeeRequest $request): FeeResource
    {
        $fee = Fee::create($request->validated());
        Cache::forget('catalog:fees');

        return new FeeResource($fee);
    }

    public function update(UpdateFeeRequest $request, Fee $fee): FeeResource
    {
        $fee->update($request->validated());
        Cache::forget('catalog:fees');

        return new FeeResource($fee);
    }

    public function destroy(Fee $fee): \Illuminate\Http\Response
    {
        $fee->update(['is_active' => false]);
        Cache::forget('catalog:fees');

        return response()->noContent();
    }
}
