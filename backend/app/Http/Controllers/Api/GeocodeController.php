<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GeocodeController extends Controller
{
    /**
     * Reverse-geocodes browser coordinates into a human-readable address via
     * OpenStreetMap Nominatim (free, no API key). Proxied through the backend
     * so the frontend never talks to Nominatim directly (avoids CORS/rate-limit
     * issues and keeps any future provider swap in one place).
     */
    public function reverse(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ]);

        $cacheKey = sprintf('geocode:reverse:%.5f,%.5f', $validated['latitude'], $validated['longitude']);

        $result = Cache::remember($cacheKey, now()->addDay(), function () use ($validated) {
            $response = Http::withHeaders(['User-Agent' => config('app.name').' (contact@x-pressing.example)'])
                ->get('https://nominatim.openstreetmap.org/reverse', [
                    'format' => 'jsonv2',
                    'lat' => $validated['latitude'],
                    'lon' => $validated['longitude'],
                ]);

            if ($response->failed()) {
                return null;
            }

            $data = $response->json();
            $address = $data['address'] ?? [];

            return [
                'full_address' => $data['display_name'] ?? null,
                'city' => $address['city'] ?? $address['town'] ?? $address['village'] ?? null,
                'district' => $address['suburb'] ?? $address['neighbourhood'] ?? null,
            ];
        });

        if ($result === null) {
            return response()->json(['message' => 'Impossible de déterminer une adresse pour cette position.'], 422);
        }

        return response()->json($result);
    }
}
