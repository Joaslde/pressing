<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

class ServiceController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ServiceResource::collection(Service::orderBy('name')->get());
    }

    public function store(StoreServiceRequest $request): ServiceResource
    {
        $service = Service::create($request->validated());
        Cache::forget('catalog:services');

        return new ServiceResource($service);
    }

    public function update(UpdateServiceRequest $request, Service $service): ServiceResource
    {
        $service->update($request->validated());
        Cache::forget('catalog:services');

        return new ServiceResource($service);
    }

    public function destroy(Service $service): \Illuminate\Http\Response
    {
        $service->update(['is_active' => false]);
        Cache::forget('catalog:services');

        return response()->noContent();
    }
}
