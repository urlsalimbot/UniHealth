<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('healthcare_facilities', function (Blueprint $table) {
            $table->string('facility_id')->nullable()->primary();
            $table->string('facility_code')->nullable(false);
            $table->string('facility_name')->nullable(false);
            $table->string('facility_type')->nullable(false);
            $table->string('facility_level')->nullable();
            $table->string('doh_license_number')->nullable();
            $table->string('philhealth_accreditation')->nullable();
            $table->string('facility_ownership')->nullable();
            $table->text('address')->nullable(false);
            $table->string('barangay')->nullable();
            $table->string('municipality_city')->nullable();
            $table->string('province')->nullable();
            $table->string('region')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->integer('bed_capacity')->nullable();
            $table->text('services_offered')->nullable();
            $table->string('operating_hours')->nullable();
            $table->boolean('emergency_services')->nullable();
            $table->boolean('is_active')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('healthcare_facilities');
    }
};
