<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('medication_requests', function (Blueprint $table) {
            $table->id();
            $table->uuid('patient_id');
            // $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->binary('prescription_file'); // will become LONGBLOB later
            $table->string('mime_type');
            $table->enum('status', ['pending', 'approved', 'rejected', 'fulfilled'])->default('pending');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });

        // 🔧 Alter column to LONGBLOB manually (for large file support)
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE medication_requests MODIFY prescription_file LONGBLOB');
        }
    }
    public function down(): void
    {
        Schema::dropIfExists('medication_requests');
    }
};

