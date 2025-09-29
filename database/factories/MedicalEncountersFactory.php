<?php

namespace Database\Factories;

use App\Models\HealthcareFacilities;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Patients;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MedicalEncounters>
 */
class MedicalEncountersFactory extends Factory
{

    public function definition(): array
    {
        return [
            'encounter_id' => (string) Str::uuid(),
            'patient_id' => Patients::inRandomOrder()->first()->patient_id,
            'facility_id' => HealthcareFacilities::inRandomOrder()->first()->facility_id,
            'encounter_type' => $this->faker->word(),
            'encounter_class' => $this->faker->word(),
            'chief_complaint' => $this->faker->sentence(),
            'encounter_date' => $this->faker->date(),
            'encounter_time' => $this->faker->word(),
            'admission_date' => $this->faker->date(),
            'discharge_date' => $this->faker->date(),
            'encounter_status' => $this->faker->word(),
            'created_by' => User::whereIn('role', ['administrator', 'staff'])->inRandomOrder()->first()->name,
        ];
    }
}
