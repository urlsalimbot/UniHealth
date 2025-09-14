<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DataAccessLog;

class DataAccessLogTableSeeder extends Seeder
{
    public function run(): void
    {
        DataAccessLog::factory()->count(10)->create();
    }
}
