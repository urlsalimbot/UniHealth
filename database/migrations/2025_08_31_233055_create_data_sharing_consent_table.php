<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_sharing_consent', function (Blueprint $table) {
            $table->string('consent_id')->nullable()->primary();
            $table->string('patient_id')->nullable(false);
            $table->string('consent_type')->nullable(false);
            $table->string('consent_status')->nullable(false);
            $table->date('consent_date')->nullable(false);
            $table->date('consent_expiry_date')->nullable();
            $table->text('data_categories')->nullable();
            $table->text('permitted_uses')->nullable();
            $table->text('restrictions')->nullable();
            $table->string('legal_basis')->nullable();
            $table->string('witness_name')->nullable();
            $table->text('witness_signature')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_sharing_consent');
    }
};
