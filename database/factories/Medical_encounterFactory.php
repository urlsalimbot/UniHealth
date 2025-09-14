<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Medical_encounter;
use Illuminate\Support\Str;

class Medical_encounterFactory extends Factory
{
    protected $model = Medical_encounter::class;

    public function definition(): array
    {
        return [
            'encounter_id' => (string) Str::uuid(),
            'patient_id' => (string) Str::uuid(),
            'facility_id' => (string) Str::uuid(),
            'attending_provider_id' => (string) Str::uuid(),
            'encounter_type' => $this->faker->word(),
            'encounter_class' => $this->faker->word(),
            'chief_complaint' => $this->faker->sentence(),
            'encounter_date' => $this->faker->date(),
            'encounter_time' => $this->faker->word(),
            'admission_date' => $this->faker->date(),
            'discharge_date' => $this->faker->date(),
            'case_rate_code' => $this->faker->word(),
            'drg_code' => $this->faker->word(),
            'encounter_status' => $this->faker->word(),
            'total_charges' => $this->faker->randomFloat(2, 0, 9999),
            'philhealth_claims' => $this->faker->randomFloat(2, 0, 9999),
            'patient_payment' => $this->faker->randomFloat(2, 0, 9999),
            'created_by' => (string) Str::uuid(),
        ];
    }
}
