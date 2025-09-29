<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Medications;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Medications>
 */
class MedicationsFactory extends Factory
{
    public function definition(): array
    {
        return [
            'medication_id' => 'MED' . $this->faker->unique()->numberBetween(100, 999),
            'generic_name' => $this->faker->word(),
            'brand_names' => $this->faker->words(2, true),
            'strength' => $this->faker->numberBetween(100, 1000) . 'mg',
            'dosage_form' => $this->faker->randomElement(['Tablet', 'Capsule', 'Syrup', 'Injection']),
            'drug_class' => $this->faker->word(),
            'controlled_substance' => $this->faker->boolean(),
            'fda_registration' => $this->faker->word(),
        ];
    }
}
