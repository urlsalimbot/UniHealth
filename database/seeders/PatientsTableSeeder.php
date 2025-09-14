<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Patient;

class PatientsTableSeeder extends Seeder
{
    public function run(): void
    {
        Patient::factory()->count(10)->create();
    }
}
