<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DataSharingConsent>
 */
class DataSharingConsentFactory extends Factory
{
    protected $model = DataSharingConsent::class;

    public function definition(): array
    {
        return [
            'consent_id' => (string) Str::uuid(),
            'patient_id' => (string) Str::uuid(),
            'consent_type' => $this->faker->word(),
            'consent_status' => $this->faker->word(),
            'consent_date' => $this->faker->date(),
            'consent_expiry_date' => $this->faker->date(),
            'data_categories' => $this->faker->sentence(),
            'permitted_uses' => $this->faker->sentence(),
            'restrictions' => $this->faker->sentence(),
            'legal_basis' => $this->faker->word(),
            'witness_name' => $this->faker->name(),
            'witness_signature' => $this->faker->sentence(),
        ];
    }
}
