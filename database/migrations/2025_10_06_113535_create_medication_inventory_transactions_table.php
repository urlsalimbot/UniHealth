<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('medication_inventory_transactions', function (Blueprint $table) {
            $table->uuid('transaction_id')->primary();

            // Core relationships
            $table->string('inventory_id');
            $table->string('facility_id');
            $table->string('medication_id');

            // Transaction metadata
            $table->enum('transaction_type', [
                'intake',
                'release',
                'transfer_in',
                'transfer_out',
                'adjustment'
            ]);

            $table->enum('direction', ['in', 'out']);
            $table->integer('quantity');
            $table->string('reference_no')->nullable();
            $table->text('remarks')->nullable();

            // Audit
            $table->foreignId('performed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            // Foreign keys
            $table->foreign('inventory_id')
                ->references('inventory_id')
                ->on('facility_medication_inventory')
                ->onDelete('cascade');

            $table->foreign('facility_id')
                ->references('facility_id')
                ->on('facilities')
                ->onDelete('cascade');

            $table->foreign('medication_id')
                ->references('medication_id')
                ->on('medications')
                ->onDelete('cascade');

            // Indexes for faster lookups
            $table->index(['facility_id', 'medication_id']);
            $table->index(['transaction_type', 'direction']);
            $table->index(['created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medication_inventory_transactions');
    }
};

