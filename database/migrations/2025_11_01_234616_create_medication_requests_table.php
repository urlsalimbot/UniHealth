<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('medication_requests', function (Blueprint $table) {
            $table->id();
            $table->uuid('patient_id');
            $table->foreign('patient_id')->references('patient_id')->on('patients');
            $table->string('prescription_file');
            $table->enum('status', ['pending', 'approved', 'fulfilled', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medication_requests');
    }
};
