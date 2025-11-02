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
    protected $model = Patients::class;

    // Filipino names and locations for realistic data
    private $filipinoSurnames = ['Reyes', 'Cruz', 'Santos', 'Garcia', 'Mendoza', 'Flores', 'Torres', 'Ramos', 'Castillo', 'De Leon', 'Aquino', 'Villanueva', 'Lopez', 'Rivera', 'Molina'];
    private $filipinoFirstNames = ['Juan', 'Maria', 'Jose', 'Ana', 'Antonio', 'Rosa', 'Miguel', 'Carmen', 'Carlos', 'Elena', 'Roberto', 'Lourdes', 'Francisco', 'Teresa', 'Manuel', 'Patricia'];
    private $philippineRegions = ['NCR', 'CALABARZON', 'Central Luzon', 'Western Visayas', 'Central Visayas', 'Davao Region', 'Northern Mindanao', 'SOCCSKSARGEN'];
    private $philippineProvinces = ['Manila', 'Quezon', 'Cebu', 'Davao del Sur', 'Laguna', 'Cavite', 'Bulacan', 'Rizal', 'Negros Occidental', 'Pampanga'];
    
    public function definition(): array
    {
        $surname = $this->faker->randomElement($this->filipinoSurnames);
        $firstName = $this->faker->randomElement($this->filipinoFirstNames);
        $middleName = $this->faker->randomElement($this->filipinoFirstNames);
        $gender = $this->faker->randomElement(['Male', 'Female']);
        $birthDate = $this->faker->dateTimeBetween('-80 years', '-1 year');
        
        return [
            'patient_id' => (string) Str::uuid(),
            'philhealth_id' => 'PH-' . $this->faker->unique()->numerify('##########'),
            'pwd_id' => $this->faker->optional(0.1)->numerify('PWD-##-#####'), // 10% chance of having PWD ID
'senior_citizen_id' => $this->faker->optional(0.2)->passthrough(
    function () use ($birthDate) {
        // Assign SC ID only if patient is 60 or older
        return $birthDate->diff(new \DateTime())->y >= 60
            ? 'SC-' . $this->faker->numerify('##-#####')
            : null;
    }
),
            
            'last_name' => $surname,
            'first_name' => $firstName,
            'middle_name' => $middleName,
            'suffix' => $this->faker->optional(0.05)->randomElement(['Jr', 'Sr', 'II', 'III']),
            'maiden_name' => $gender === 'Female' ? $this->faker->optional(0.3)->randomElement($this->filipinoSurnames) : null,
            'nickname' => $this->faker->optional(0.7)->firstName(),
            
            'date_of_birth' => $birthDate->format('Y-m-d'),
            'place_of_birth' => $this->faker->randomElement($this->philippineProvinces) . ', Philippines',
            'gender' => $gender,
            'civil_status' => $this->faker->randomElement(['Single', 'Married', 'Widowed', 'Separated']),
            'nationality' => 'Filipino',
            'religion' => $this->faker->randomElement(['Roman Catholic', 'Protestant', 'Islam', 'Iglesia ni Cristo', 'Other']),
            
            'mobile_number' => '09' . $this->faker->numerify('########'),
            'landline_number' => $this->faker->optional(0.3)->numerify('(###) ###-####'),
            'email' => $this->faker->unique()->safeEmail(),
            
            'house_number' => $this->faker->numberBetween(1, 999),
            'street' => $this->faker->streetName() . ' Street',
            'barangay' => 'Barangay ' . $this->faker->numberBetween(1, 50),
            'municipality_city' => $this->faker->randomElement(['Quezon City', 'Manila', 'Cebu City', 'Davao City', 'Caloocan', 'Pasig']),
            'province' => $this->faker->randomElement($this->philippineProvinces),
            'region' => $this->faker->randomElement($this->philippineRegions),
            'postal_code' => $this->faker->numerify('####'),
            
            'emergency_contact_name' => $this->faker->name(),
            'emergency_contact_relationship' => $this->faker->randomElement(['Spouse', 'Parent', 'Sibling', 'Child', 'Relative']),
            'emergency_contact_number' => '09' . $this->faker->numerify('########'),
            'emergency_contact_address' => $this->faker->address(),
            
            'created_by' => null, // Will be set in configure()
            'updated_by' => null,
            'is_active' => true,
            'data_privacy_consent' => true,
            'data_privacy_consent_date' => now()->subDays($this->faker->numberBetween(1, 365)),
        ];
    }

   public function configure()
{
    return $this->afterCreating(function (Patients $patient) {
        // ✅ Get or create a system user
        $user = User::first() ?? User::factory()->create([
            'name' => 'Audit Seeder User',
            'email' => 'audit@example.com',
        ]);

        // ✅ Simulate auditing without actual Auth login
        $patient->auditEvent = 'created';
        $auditData = $patient->toAudit();

        // ✅ Manually attach user_id
        $auditData['user_id'] = $user->id;

        Audit::create($auditData);

        // ✅ Record creator reference
        $patient->created_by = $user->id;
        $patient->saveQuietly();
    });
}

}
