<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\VitalSigns;

class VitalSignsTableSeeder extends Seeder
{
    public function run(): void
    {
        VitalSigns::factory()->count(10)->create();
    }
}
