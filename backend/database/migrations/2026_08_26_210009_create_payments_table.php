<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->enum('method', ['kkiapay', 'fedapay']);
            $table->string('transaction_reference')->nullable();
            $table->string('status')->default('pending');
            $table->json('raw_response')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index('order_id');
            $table->index('transaction_reference');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
