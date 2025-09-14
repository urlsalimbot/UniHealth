<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facility_medication_inventory', function (Blueprint $table) {
            $table->string('inventory_id')->nullable()->primary();
            $table->string('facility_id')->nullable(false);
            $table->string('medication_id')->nullable(false);
            $table->integer('current_stock')->nullable(false);
            $table->integer('minimum_stock_level')->nullable(false);
            $table->integer('maximum_stock_level')->nullable(false);
            $table->integer('reorder_point')->nullable(false);
            $table->string('lot_number')->nullable();
            $table->date('expiration_date')->nullable();
            $table->string('manufacturer_batch')->nullable();
            $table->decimal('unit_cost')->nullable();
            $table->decimal('total_value')->nullable();
            $table->string('storage_location')->nullable();
            $table->string('storage_conditions')->nullable();
            $table->decimal('storage_temperature_min')->nullable();
            $table->decimal('storage_temperature_max')->nullable();
            $table->string('supplier')->nullable();
            $table->string('purchase_order_number')->nullable();
            $table->date('received_date')->nullable();
            $table->string('received_by')->nullable();
            $table->string('stock_status')->nullable();
            $table->date('last_count_date')->nullable();
            $table->string('last_counted_by')->nullable();
            $table->boolean('expiry_alert_sent')->nullable();
            $table->boolean('low_stock_alert_sent')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facility_medication_inventory');
    }
};
