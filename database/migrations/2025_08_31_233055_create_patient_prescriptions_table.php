<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patient_prescriptions', function (Blueprint $table) {
            $table->string('prescription_id')->nullable()->primary();
            $table->string('patient_id')->nullable(false);
            $table->string('encounter_id')->nullable();
            $table->string('medication_id')->nullable(false);
            $table->string('dosage')->nullable(false);
            $table->string('frequency')->nullable(false);
            $table->string('route')->nullable();
            $table->string('duration')->nullable();
            $table->integer('quantity_prescribed')->nullable();
            $table->integer('refills_allowed')->nullable();
            $table->text('special_instructions')->nullable();
            $table->text('indication')->nullable();
            $table->date('prescription_date')->nullable(false);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('prescription_status')->nullable();
            $table->dateTime('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_prescriptions');
    }
};
