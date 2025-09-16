<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Patients;
use Illuminate\Support\Str;

class PatientsFactory extends Factory
{
    protected $model = Patients::class;

    public function definition(): array
    {
        return [
            'patient_id' => (string) Str::uuid(),
            'philhealth_id' => $this->faker->word(),
            'pwd_id' => $this->faker->word(),
            'senior_citizen_id' => $this->faker->word(),
            'last_name' => $this->faker->lastName(),
            'first_name' => $this->faker->firstName(),
            'middle_name' => $this->faker->firstName(),
            'suffix' => $this->faker->word(),
            'maiden_name' => $this->faker->name(),
            'nickname' => $this->faker->firstName(),
            'date_of_birth' => $this->faker->date(),
            'place_of_birth' => $this->faker->word(),
            'gender' => $this->faker->word(),
            'civil_status' => $this->faker->word(),
            'nationality' => $this->faker->word(),
            'religion' => $this->faker->word(),
            'mobile_number' => $this->faker->phoneNumber(),
            'landline_number' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'house_number' => $this->faker->word(),
            'street' => $this->faker->streetName(),
            'barangay' => $this->faker->word(),
            'municipality_city' => $this->faker->city(),
            'province' => $this->faker->state(),
            'region' => $this->faker->word(),
            'postal_code' => $this->faker->postcode(),
            'emergency_contact_name' => $this->faker->name(),
            'emergency_contact_relationship' => $this->faker->word(),
            'emergency_contact_number' => $this->faker->word(),
            'emergency_contact_address' => $this->faker->address(),
            'created_by' => $this->faker->word(),
            'updated_by' => $this->faker->word(),
            'is_active' => $this->faker->boolean(),
            'data_privacy_consent' => $this->faker->boolean(),
            'data_privacy_consent_date' => $this->faker->dateTime(),
        ];
    }
}
