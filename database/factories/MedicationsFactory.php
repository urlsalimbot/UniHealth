<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Medications;
use Illuminate\Support\Str;

class MedicationsFactory extends Factory
{
    protected $model = Medications::class;

    public function definition(): array
    {
        return [
            'medication_id' => (string) Str::uuid(),
            'generic_name' => $this->faker->name(),
            'brand_names' => $this->faker->name(),
            'strength' => $this->faker->word(),
            'dosage_form' => $this->faker->word(),
            'drug_class' => $this->faker->word(),
            'controlled_substance' => $this->faker->boolean(),
            'fda_registration' => $this->faker->word(),
        ];
    }
}
