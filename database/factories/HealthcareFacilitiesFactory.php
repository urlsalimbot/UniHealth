<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HealthcareFacilities>
 */
class HealthcareFacilitiesFactory extends Factory
{

    public function definition(): array
    {
        return [
            'facility_id' => 'FACI' . $this->faker->unique()->numberBetween(100, 999),
            'facility_code' => $this->faker->word(),
            'facility_name' => $this->faker->name(),
            'facility_type' => $this->faker->word(),
            'facility_level' => $this->faker->word(),
            'doh_license_number' => $this->faker->word(),
            'philhealth_accreditation' => $this->faker->word(),
            'facility_ownership' => $this->faker->word(),
            'address' => $this->faker->address(),
            'barangay' => $this->faker->word(),
            'municipality_city' => $this->faker->city(),
            'province' => $this->faker->state(),
            'region' => $this->faker->word(),
            'phone_number' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'website' => $this->faker->word(),
            'bed_capacity' => $this->faker->city(),
            'services_offered' => $this->faker->sentence(),
            'operating_hours' => $this->faker->word(),
            'emergency_services' => $this->faker->boolean(),
            'is_active' => $this->faker->boolean(),
        ];
    }
}
