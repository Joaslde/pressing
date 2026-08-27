<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FeeResource;
use App\Models\Fee;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

class FeeController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $fees = Cache::remember('catalog:fees', now()->addHour(), function () {
            return Fee::where('is_active', true)->get();
        });

        return FeeResource::collection($fees);
    }
}
