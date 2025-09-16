<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Patients;

class PatientsTableSeeder extends Seeder
{
    public function run(): void
    {
        Patients::factory()->count(10)->create();
    }
}
