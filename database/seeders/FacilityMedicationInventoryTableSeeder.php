<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FacilityMedicationInventory;

class FacilityMedicationInventoryTableSeeder extends Seeder
{
    public function run(): void
    {
        FacilityMedicationInventory::factory()->count(10)->create();
    }
}
