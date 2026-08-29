<?php

use App\Http\Middleware\EnsureUserHasRole;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Bearer-token auth only (see AuthController) - no cookie/session
        // fallback, so the frontend and API can safely live on different
        // domains without depending on cross-site cookies.

        // Coolify puts the container behind a Traefik reverse proxy, so every
        // request arrives from the proxy's IP over plain http. Without trusted
        // proxies, url()/route() emit http:// links and the API rate limiter
        // buckets every client together. Only the proxy can reach the
        // container on the internal Docker network, so '*' is safe here;
        // TRUSTED_PROXIES narrows it to explicit IPs if that ever changes.
        $proxies = env('TRUSTED_PROXIES', '*');
        $middleware->trustProxies(at: $proxies === '*' ? '*' : explode(',', $proxies));

        $middleware->alias([
            'role' => EnsureUserHasRole::class,
        ]);

        $middleware->throttleApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Non authentifié.'], 401);
            }
        });

        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'errors' => $e->errors(),
                ], 422);
            }
        });
    })->create();
