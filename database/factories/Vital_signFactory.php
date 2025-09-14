<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Vital_sign;
use Illuminate\Support\Str;

class Vital_signFactory extends Factory
{
    protected $model = Vital_sign::class;

    public function definition(): array
    {
        return [
            'vital_sign_id' => (string) Str::uuid(),
            'patient_id' => (string) Str::uuid(),
            'encounter_id' => (string) Str::uuid(),
            'recorded_by' => (string) Str::uuid(),
            'measurement_date' => $this->faker->date(),
            'measurement_time' => $this->faker->word(),
            'systolic_bp' => $this->faker->randomNumber(),
            'diastolic_bp' => $this->faker->randomNumber(),
            'heart_rate' => $this->faker->randomNumber(),
            'respiratory_rate' => $this->faker->randomNumber(),
            'temperature' => $this->faker->randomFloat(2, 0, 9999),
            'oxygen_saturation' => $this->faker->randomNumber(),
            'weight' => $this->faker->randomFloat(2, 0, 9999),
            'height' => $this->faker->randomFloat(2, 0, 9999),
            'bmi' => $this->faker->randomFloat(2, 0, 9999),
            'pain_score' => $this->faker->randomNumber(),
            'pain_location' => $this->faker->sentence(),
            'general_appearance' => $this->faker->sentence(),
            'mental_status' => $this->faker->sentence(),
            'bp_cuff_size' => $this->faker->word(),
            'thermometer_type' => $this->faker->word(),
        ];
    }
}
