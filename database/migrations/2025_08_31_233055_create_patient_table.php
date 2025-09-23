<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->string('patient_id')->primary();
            $table->string('philhealth_id')->nullable();
            $table->string('pwd_id')->nullable();
            $table->string('senior_citizen_id')->nullable();
            $table->string('last_name')->nullable(false);
            $table->string('first_name')->nullable(false);
            $table->string('middle_name')->nullable();
            $table->string('suffix')->nullable();
            $table->string('maiden_name')->nullable();
            $table->string('nickname')->nullable();
            $table->date('date_of_birth')->nullable(false);
            $table->string('place_of_birth')->nullable();
            $table->string('gender')->nullable();
            $table->string('civil_status')->nullable();
            $table->string('nationality')->nullable();
            $table->string('religion')->nullable();
            $table->string('mobile_number')->nullable();
            $table->string('landline_number')->nullable();
            $table->string('email')->nullable();
            $table->string('house_number')->nullable();
            $table->string('street')->nullable();
            $table->string('barangay')->nullable(false);
            $table->string('municipality_city')->nullable(false);
            $table->string('province')->nullable(false);
            $table->string('region')->nullable(false);
            $table->string('postal_code')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_relationship')->nullable();
            $table->string('emergency_contact_number')->nullable();
            $table->text('emergency_contact_address')->nullable();
            $table->string('created_by')->nullable();
            $table->string('updated_by')->nullable();
            $table->boolean('is_active')->nullable();
            $table->boolean('data_privacy_consent')->nullable();
            $table->time('data_privacy_consent_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
