<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatientPrescriptions;

class PatientPrescriptionsTableSeeder extends Seeder
{
    public function run(): void
    {
        PatientPrescriptions::factory()->count(10)->create();
    }
}
