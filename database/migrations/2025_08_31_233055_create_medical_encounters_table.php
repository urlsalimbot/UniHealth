<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medical_encounters', function (Blueprint $table) {
            $table->string('encounter_id')->nullable()->primary();
            $table->string('patient_id')->nullable(false);
            $table->string('facility_id')->nullable(false);
            $table->string('attending_provider_id')->nullable();
            $table->string('encounter_type')->nullable(false);
            $table->string('encounter_class')->nullable();
            $table->text('chief_complaint')->nullable();
            $table->date('encounter_date')->nullable(false);
            $table->time('encounter_time')->nullable();
            $table->date('admission_date')->nullable();
            $table->date('discharge_date')->nullable();
            $table->string('case_rate_code')->nullable();
            $table->string('drg_code')->nullable();
            $table->string('encounter_status')->nullable();
            $table->decimal('total_charges')->nullable();
            $table->decimal('philhealth_claims')->nullable();
            $table->decimal('patient_payment')->nullable();
            $table->string('created_by')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_encounters');
    }
};
