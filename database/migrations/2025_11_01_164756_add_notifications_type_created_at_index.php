<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNotificationsTypeCreatedAtIndex extends Migration
{
    public function up()
    {
        Schema::table('notifications', function (Blueprint $table) {
            // add index on type and created_at to speed dedupe search
            $table->index(['type', 'created_at'], 'notifications_type_created_at_idx');
        });
    }

    public function down()
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex('notifications_type_created_at_idx');
        });
    }
}
