<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\DataAccessLog;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DataAccessLog>
 */
class DataAccessLogFactory extends Factory
{

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
