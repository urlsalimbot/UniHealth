<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Patients;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $role = $this->faker->randomElement([
            User::ROLE_ADMIN,
            User::ROLE_STAFF,
            User::ROLE_PTNT,
            User::ROLE_PHARM,
            User::ROLE_DOCTOR,
        ]);

        $name = $this->faker->name();
        $patientId = null;

        // ✅ If user is a patient, attach a random Patient record
        if ($role === User::ROLE_PTNT) {
            $patient = Patients::inRandomOrder()->first();

            // Create one if none exist (so seeding won't break)
            if (!$patient) {
                $patient = Patients::factory()->create();
            }

            $name = trim($patient->first_name . ' ' . $patient->last_name);
            $patientId = $patient->patient_id; // or $patient->id depending on your schema
        }

        return [
            'name' => $name,
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => $role,
            'patient_id' => $patientId,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
