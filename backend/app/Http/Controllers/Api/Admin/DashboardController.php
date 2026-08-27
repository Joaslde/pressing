<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentTransactionStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Cahier §17: today's KPIs + basic period stats. Cached briefly since
     * this aggregates across several tables and the dashboard is polled often.
     */
    public function index(): JsonResponse
    {
        $data = Cache::remember('admin:dashboard:stats', now()->addMinutes(2), function () {
            $today = today();

            return [
                'today' => [
                    'orders_count' => Order::whereDate('created_at', $today)->count(),
                    'orders_pending' => Order::whereIn('status', [
                        OrderStatus::PendingPayment->value,
                        OrderStatus::Confirmed->value,
                    ])->count(),
                    'pickups_scheduled' => Order::where('status', OrderStatus::PickupScheduled)
                        ->whereDate('pickup_date', $today)->count(),
                    'deliveries_scheduled' => Order::where('status', OrderStatus::DeliveryScheduled)->count(),
                    'payments_received' => (float) Payment::where('status', PaymentTransactionStatus::Succeeded)
                        ->whereDate('paid_at', $today)->sum('amount'),
                    'revenue' => (float) Order::whereDate('created_at', $today)
                        ->whereNotIn('status', [OrderStatus::Cancelled->value, OrderStatus::Draft->value])
                        ->sum('estimated_amount'),
                ],
                'top_services' => Order::select('service_id', DB::raw('count(*) as total'))
                    ->with('service:id,name')
                    ->groupBy('service_id')
                    ->orderByDesc('total')
                    ->limit(5)
                    ->get()
                    ->map(fn ($row) => ['name' => $row->service?->name, 'total' => $row->total]),
                'active_clients' => User::where('role', 'client')->where('is_active', true)->count(),
            ];
        });

        return response()->json($data);
    }
}
