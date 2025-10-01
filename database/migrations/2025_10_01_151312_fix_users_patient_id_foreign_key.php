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
        Schema::table('users', function (Blueprint $table) {
            // 1. Drop old foreign key if it exists
            try {
                $table->dropForeign(['patient_id']);
            } catch (\Exception $e) {
                // Ignore if foreign key doesn't exist
            }

            // 2. Change patient_id to UUID + nullable
            $table->uuid('patient_id')->nullable()->change();

            // 3. Re-add correct foreign key constraint
            $table->foreign('patient_id')
                ->references('patient_id') // 👈 Patients::$primaryKey
                ->on('patients')
                ->nullOnDelete(); // set NULL if patient is deleted
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Rollback: drop FK and turn back into integer (if that was the original)
            $table->dropForeign(['patient_id']);
            $table->unsignedBigInteger('patient_id')->nullable()->change();
        });
    }
};
