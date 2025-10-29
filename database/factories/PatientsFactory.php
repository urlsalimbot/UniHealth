<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Patients;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

use OwenIt\Auditing\Models\Audit;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Patients>
 */
class PatientsFactory extends Factory
{


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

    public function configure()
    {
        return $this->afterCreating(function (Patients $patient) {
            // ✅ Fake a logged-in user for auditing context
            $user = User::first() ?? User::factory()->create([
                'name' => 'Audit Seeder User',
                'email' => 'audit@example.com',
            ]);
            Auth::login($user);

            // ✅ Mark as "created" audit event and manually log it
            $patient->auditEvent = 'created';
            $auditData = $patient->toAudit(); // returns array ready for Audit model

            Audit::create($auditData); // manually inserts audit record

            // ✅ Add creator reference (optional)
            $patient->created_by = $user->id;
            $patient->saveQuietly();

            Auth::logout();
        });
    }
}
