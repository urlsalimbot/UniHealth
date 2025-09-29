<?php

namespace Database\Factories;

use App\Models\MedicalEncounters;
use App\Models\Patients;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VitalSigns>
 */
class VitalSignsFactory extends Factory
{
    public function definition(): array
    {   

        $encounter = MedicalEncounters::inRandomOrder()->first();

        return [
            'vital_sign_id' => (string) Str::uuid(),
            'patient_id' => Patients::inRandomOrder()->first()->patient_id,
            'encounter_id' => $encounter->encounter_id,
            'recorded_by' => User::whereIn('role', ['administrator', 'staff'])->inRandomOrder()->first()->name,
            'measurement_date' => $encounter->encounter_date,
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
