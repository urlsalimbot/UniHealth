<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medications', function (Blueprint $table) {
            $table->string('medication_id')->nullable()->primary();
            $table->string('generic_name')->nullable(false);
            $table->text('brand_names')->nullable();
            $table->string('strength')->nullable();
            $table->string('dosage_form')->nullable();
            $table->string('drug_class')->nullable();
            $table->boolean('controlled_substance')->nullable();
            $table->string('fda_registration')->nullable();
            $table->dateTime('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medications');
    }
};
