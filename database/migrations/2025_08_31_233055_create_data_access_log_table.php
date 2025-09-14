<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_access_log', function (Blueprint $table) {
            $table->string('log_id')->nullable()->primary();
            $table->string('patient_id')->nullable();
            $table->string('accessed_by')->nullable();
            $table->string('facility_id')->nullable();
            $table->date('access_date')->nullable(false);
            $table->time('access_time')->nullable(false);
            $table->string('access_type')->nullable();
            $table->string('table_accessed')->nullable();
            $table->string('record_id')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('session_id')->nullable();
            $table->string('access_purpose')->nullable();
            $table->text('justification')->nullable();
            $table->dateTime('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_access_log');
    }
};
