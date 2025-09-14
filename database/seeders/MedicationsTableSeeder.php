<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Medications;

class MedicationsTableSeeder extends Seeder
{
    public function run(): void
    {
        Medications::factory()->count(10)->create();
    }
}
