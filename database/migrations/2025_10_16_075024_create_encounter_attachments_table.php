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
        Schema::create('encounter_attachments', function (Blueprint $table) {
            $table->uuid('attachment_id')->primary();
            $table->uuid('encounter_id'); // FK to medical_encounters
            $table->string('label')->nullable();
            $table->string('file_path'); // path or filename stored in storage/app/public or s3
            $table->timestamps();

            $table->foreign('encounter_id')
                ->references('encounter_id')
                ->on('medical_encounters')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('encounter_attachments');
    }
};
