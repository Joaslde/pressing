<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Status/payment_status values mirror the cahier des charges (§13, §11.2);
     * see App\Enums\OrderStatus and App\Enums\PaymentStatus for the canonical
     * list and the French labels shown to users.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_id')->constrained();
            $table->foreignId('pickup_address_id')->constrained('addresses');
            $table->foreignId('delivery_address_id')->constrained('addresses');
            $table->date('pickup_date');
            $table->foreignId('time_slot_id')->constrained();
            $table->decimal('estimated_amount', 10, 2);
            $table->decimal('final_amount', 10, 2)->nullable();
            $table->decimal('deposit_amount', 10, 2)->nullable();
            $table->string('status')->default('draft');
            $table->string('payment_status')->default('unpaid');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('payment_status');
            $table->index('pickup_date');
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
