<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HealthcareFacilities;

class HealthcareFacilitiesTableSeeder extends Seeder
{
    public function run(): void
    {
        HealthcareFacilities::factory()->count(10)->create();
    }
}
