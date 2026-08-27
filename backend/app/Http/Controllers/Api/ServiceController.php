<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

class ServiceController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $services = Cache::remember('catalog:services', now()->addHour(), function () {
            return Service::where('is_active', true)->orderBy('name')->get();
        });

        return ServiceResource::collection($services);
    }

    public function show(Service $service): ServiceResource
    {
        return new ServiceResource($service);
    }
}
