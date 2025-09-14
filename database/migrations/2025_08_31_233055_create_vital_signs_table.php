<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vital_signs', function (Blueprint $table) {
            $table->string('vital_sign_id')->nullable()->primary();
            $table->string('patient_id')->nullable(false);
            $table->string('encounter_id')->nullable();
            $table->string('recorded_by')->nullable();
            $table->date('measurement_date')->nullable(false);
            $table->time('measurement_time')->nullable(false);
            $table->integer('systolic_bp')->nullable();
            $table->integer('diastolic_bp')->nullable();
            $table->integer('heart_rate')->nullable();
            $table->integer('respiratory_rate')->nullable();
            $table->decimal('temperature')->nullable();
            $table->integer('oxygen_saturation')->nullable();
            $table->decimal('weight')->nullable();
            $table->decimal('height')->nullable();
            $table->decimal('bmi')->nullable();
            $table->integer('pain_score')->nullable();
            $table->text('pain_location')->nullable();
            $table->text('general_appearance')->nullable();
            $table->text('mental_status')->nullable();
            $table->string('bp_cuff_size')->nullable();
            $table->string('thermometer_type')->nullable();
            $table->dateTime('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vital_signs');
    }
};
