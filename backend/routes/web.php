<?php

use Illuminate\Support\Facades\Route;

// This app is a pure JSON API (see routes/api.php) - there's no compiled
// frontend here to serve (the React app lives in a separate deployment), so
// the root route is just a lightweight liveness/landing response instead of
// Laravel's default `view('welcome')`, which depends on Vite-built assets
// that don't exist in this project and would 500.
Route::get('/', function () {
    return response()->json([
        'name' => config('app.name'),
        'status' => 'ok',
    ]);
});
