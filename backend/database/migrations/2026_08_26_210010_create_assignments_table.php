<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('delivery_person_id')->constrained('delivery_persons')->cascadeOnDelete();
            $table->enum('mission_type', ['pickup', 'delivery']);
            $table->string('status')->default('assigned');
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['order_id', 'mission_type']);
            $table->index('delivery_person_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
