<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Data_access_log;
use Illuminate\Support\Str;

class Data_access_logFactory extends Factory
{
    protected $model = Data_access_log::class;

    public function definition(): array
    {
        return [
            'log_id' => (string) Str::uuid(),
            'patient_id' => (string) Str::uuid(),
            'accessed_by' => (string) Str::uuid(),
            'facility_id' => (string) Str::uuid(),
            'access_date' => $this->faker->date(),
            'access_time' => $this->faker->word(),
            'access_type' => $this->faker->word(),
            'table_accessed' => $this->faker->word(),
            'record_id' => (string) Str::uuid(),
            'ip_address' => $this->faker->address(),
            'user_agent' => $this->faker->userName(),
            'session_id' => $this->faker->word(),
            'access_purpose' => $this->faker->word(),
            'justification' => $this->faker->sentence(),
        ];
    }
}
