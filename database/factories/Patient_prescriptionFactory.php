<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Patient_prescription;
use Illuminate\Support\Str;

class Patient_prescriptionFactory extends Factory
{
    protected $model = Patient_prescription::class;

    public function definition(): array
    {
        return [
            'prescription_id' => (string) Str::uuid(),
            'patient_id' => (string) Str::uuid(),
            'encounter_id' => (string) Str::uuid(),
            'medication_id' => (string) Str::uuid(),
            'prescribing_provider_id' => (string) Str::uuid(),
            'dosage' => $this->faker->word(),
            'frequency' => $this->faker->word(),
            'route' => $this->faker->word(),
            'duration' => $this->faker->word(),
            'quantity_prescribed' => $this->faker->randomNumber(),
            'refills_allowed' => $this->faker->randomNumber(),
            'special_instructions' => $this->faker->sentence(),
            'indication' => $this->faker->sentence(),
            'prescription_date' => $this->faker->date(),
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->date(),
            'prescription_status' => $this->faker->word(),
        ];
    }
}
