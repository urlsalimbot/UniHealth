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
            'recorded_by' => User::whereIn('role', ['administrator', 'doctor', 'intake-staff'])->inRandomOrder()->first()->name,
            'measurement_date' => $encounter->encounter_date,
            'measurement_time' => sprintf(
                '%02d:%02d',
                $this->faker->numberBetween(8, 18),  // hours: 8AM to 6PM
                $this->faker->numberBetween(0, 59)   // minutes
            ),
            'systolic_bp' => $this->faker->randomFloat(0, 40, 200),
            'diastolic_bp' => $this->faker->randomFloat(0, 80, 300),
            'heart_rate' => $this->faker->randomFloat(0, 60, 180),
            'respiratory_rate' => $this->faker->randomFloat(1, 60, 100),
            'temperature' => $this->faker->randomFloat(1, 30, 50),
            'oxygen_saturation' => $this->faker->randomFloat(1, 60, 100),
            'weight' => $this->faker->randomFloat(2, 10, 200),
            'height' => $this->faker->randomFloat(1, 110, 220),
            'bmi' => $this->faker->randomFloat(1, 15, 40),
            'pain_score' => $this->faker->randomFloat(0, 0, 10),
            'pain_location' => $this->faker->sentence(),
            'general_appearance' => $this->faker->sentence(),
            'mental_status' => $this->faker->sentence(),
            'bp_cuff_size' => $this->faker->randomFloat(0, 1, 5),
            'thermometer_type' => $this->faker->word(),
        ];
    }
}
