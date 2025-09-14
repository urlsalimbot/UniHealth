<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MedicalEncounters;

class MedicalEncountersTableSeeder extends Seeder
{
    public function run(): void
    {
        MedicalEncounters::factory()->count(10)->create();
    }
}
