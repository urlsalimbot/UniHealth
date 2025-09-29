<?php

namespace Database\Seeders;

use App\Models\HealthcareFacilities;
use App\Models\MedicalEncounters;
use App\Models\PatientPrescriptions;
use App\Models\User;
use App\Models\Patients;
use App\Models\FacilityMedicationInventory;
use App\Models\Medications;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\VitalSigns;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::factory(10)->create();
        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        //     'password' => bcrypt('1234'),
        //     'role' => 'administrator',
        // ]);

        Patients::factory(10)->create();
        HealthcareFacilities::factory()->count(1)->create();

        Medications::factory(10)->create();
        FacilityMedicationInventory::factory(10)->create();

        MedicalEncounters::factory(50)->create();
        PatientPrescriptions::factory(50)->create();
        VitalSigns::factory(50)->create();



    }

}
