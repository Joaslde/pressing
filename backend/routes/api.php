<?php

use App\Http\Controllers\Api\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Api\Admin\ClientController as AdminClientController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\FeeController as AdminFeeController;
use App\Http\Controllers\Api\Admin\LivreurController as AdminLivreurController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\Admin\TimeSlotController as AdminTimeSlotController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\FeeController;
use App\Http\Controllers\Api\GeocodeController;
use App\Http\Controllers\Api\Livreur\DashboardController as LivreurDashboardController;
use App\Http\Controllers\Api\Livreur\MissionController as LivreurMissionController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\TimeSlotController;
use App\Http\Controllers\Api\Webhooks\PaymentWebhookController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // --- Public ---------------------------------------------------------
    Route::middleware('throttle:auth')->group(function () {
        Route::post('/auth/register', [AuthController::class, 'register']);
        Route::post('/auth/login', [AuthController::class, 'login']);
        Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
    });

    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{service:slug}', [ServiceController::class, 'show']);
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/fees', [FeeController::class, 'index']);
    Route::get('/time-slots', [TimeSlotController::class, 'index']);

    Route::post('/webhooks/kkiapay', [PaymentWebhookController::class, 'kkiapay']);
    Route::post('/webhooks/fedapay', [PaymentWebhookController::class, 'fedapay']);

    // --- Authenticated (any role) ----------------------------------------
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::patch('/auth/profile', [AuthController::class, 'updateProfile']);

        Route::get('/geocode/reverse', [GeocodeController::class, 'reverse']);

        Route::apiResource('addresses', AddressController::class)->except(['show']);

        Route::get('/payments/methods', [PaymentController::class, 'methods']);

        Route::apiResource('orders', OrderController::class)->only(['index', 'store', 'show']);

        Route::middleware('throttle:payment')->group(function () {
            Route::post('/orders/{order}/payments/checkout', [PaymentController::class, 'checkout']);
            Route::post('/payments/{payment}/verify', [PaymentController::class, 'verify']);
        });
    });

    // --- Livreur -----------------------------------------------------------
    Route::middleware(['auth:sanctum', 'role:livreur'])->prefix('livreur')->group(function () {
        Route::get('/dashboard', [LivreurDashboardController::class, 'index']);
        Route::get('/missions', [LivreurMissionController::class, 'index']);
        Route::post('/missions/{assignment}/confirm', [LivreurMissionController::class, 'confirm']);
    });

    // --- Admin ------------------------------------------------------------
    Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
        Route::apiResource('services', AdminServiceController::class)->except(['show']);
        Route::apiResource('articles', AdminArticleController::class)->except(['show']);
        Route::apiResource('fees', AdminFeeController::class)->except(['show']);
        Route::apiResource('time-slots', AdminTimeSlotController::class)->except(['show']);

        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/{order}', [AdminOrderController::class, 'show']);
        Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus']);
        Route::post('/orders/{order}/assign', [AdminOrderController::class, 'assignLivreur']);

        Route::get('/clients', [AdminClientController::class, 'index']);
        Route::get('/clients/{client}', [AdminClientController::class, 'show']);
        Route::patch('/clients/{client}/toggle-active', [AdminClientController::class, 'toggleActive']);

        Route::get('/livreurs', [AdminLivreurController::class, 'index']);
        Route::post('/livreurs', [AdminLivreurController::class, 'store']);
        Route::put('/livreurs/{livreur}', [AdminLivreurController::class, 'update']);
        Route::patch('/livreurs/{livreur}/toggle-active', [AdminLivreurController::class, 'toggleActive']);
    });
});
