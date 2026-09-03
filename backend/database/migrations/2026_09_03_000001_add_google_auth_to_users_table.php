<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('google_id')->nullable()->unique()->after('email');
        });

        // Google's basic profile scope doesn't return a phone number, so an
        // account created via "Se connecter avec Google" starts without one
        // - nudged to fill it in from their profile page afterwards.
        // Avoids a doctrine/dbal dependency (needed for ->change()): a raw
        // ALTER on MySQL, and a drop+re-add on sqlite (test suite only,
        // where this runs against an empty fresh database so there's
        // nothing to lose).
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE users MODIFY phone VARCHAR(255) NULL');
        } else {
            Schema::table('users', function (Blueprint $table) {
                $table->dropUnique(['phone']);
            });
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('phone');
            });
            Schema::table('users', function (Blueprint $table) {
                $table->string('phone')->nullable()->unique()->after('last_name');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE users MODIFY phone VARCHAR(255) NOT NULL');
        } else {
            Schema::table('users', function (Blueprint $table) {
                $table->dropUnique(['phone']);
            });
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('phone');
            });
            Schema::table('users', function (Blueprint $table) {
                $table->string('phone')->unique()->after('last_name');
            });
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('google_id');
        });
    }
};
