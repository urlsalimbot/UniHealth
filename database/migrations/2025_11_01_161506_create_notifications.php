<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); // user-specific
            $table->string('role')->nullable(); // role-based
            $table->boolean('is_global')->default(false); // everyone
            $table->string('type')->default('system'); // 'audit', 'low_stock', 'pending_request', etc.
            $table->string('title');
            $table->text('message')->nullable();
            $table->string('action_url')->nullable(); // for clickable actions
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
