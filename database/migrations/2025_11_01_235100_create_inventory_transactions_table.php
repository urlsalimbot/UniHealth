<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();

            // Relationship to inventory stock
            $table->foreignId('facility_medication_inventory_id')
                ->constrained()
                ->cascadeOnDelete();

            // Core transaction details
            $table->enum('transaction_type', ['intake', 'release', 'adjustment', 'transfer']);
            $table->integer('quantity');
            $table->integer('previous_stock');
            $table->integer('new_stock');

            // Optional metadata
            $table->string('reference')->nullable(); // e.g. MedicationRequest #ID
            $table->text('remarks')->nullable();

            // User tracking
            $table->foreignId('performed_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_transactions');
    }
};

