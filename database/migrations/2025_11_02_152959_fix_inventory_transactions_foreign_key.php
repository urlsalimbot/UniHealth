<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop existing foreign key if it exists
        Schema::table('inventory_transactions', function (Blueprint $table) {
            $table->dropForeign(['facility_medication_inventory_id']);
        });

        // Modify the column to be string instead of bigInteger
        Schema::table('inventory_transactions', function (Blueprint $table) {
            $table->string('facility_medication_inventory_id')->change();
        });

        // Add the correct foreign key constraint
        Schema::table('inventory_transactions', function (Blueprint $table) {
            $table->foreign('facility_medication_inventory_id')
                ->references('inventory_id')
                ->on('facility_medication_inventory')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the corrected foreign key
        Schema::table('inventory_transactions', function (Blueprint $table) {
            $table->dropForeign(['facility_medication_inventory_id']);
        });

        // Revert to the original (incorrect) foreign key
        Schema::table('inventory_transactions', function (Blueprint $table) {
            $table->foreignId('facility_medication_inventory_id')->change();
            $table->foreign('facility_medication_inventory_id')
                ->constrained()
                ->cascadeOnDelete();
        });
    }
};
