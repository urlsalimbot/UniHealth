<?php

namespace Database\Factories;


use App\Models\Patients;
use App\Models\MedicalEncounters;
use App\Models\Medications;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PatientPrescriptions>
 */
class PatientPrescriptionsFactory extends Factory
{

    public function definition(): array
    {
        $encounter = MedicalEncounters::inRandomOrder()->first();

        return [
            'prescription_id' => (string) Str::uuid(), //make uuid
            'patient_id' => Patients::inRandomOrder()->first()->patient_id,
            'encounter_id' => $encounter->encounter_id,
            'medication_id' => Medications::inRandomOrder()->first()->medication_id,
            'dosage' => $this->faker->word(),
            'frequency' => $this->faker->word(),
            'route' => $this->faker->word(),
            'duration' => $this->faker->word(),
            'quantity_prescribed' => $this->faker->randomNumber(),
            'refills_allowed' => $this->faker->randomNumber(),
            'special_instructions' => $this->faker->sentence(),
            'indication' => $this->faker->sentence(),
            'prescription_date' => $encounter->encounter_date,
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->date(),
            'prescription_status' => $this->faker->word(),
        ];
    }
}
