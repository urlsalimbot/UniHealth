<?php

namespace Database\Factories;

use App\Models\Patients;
use App\Models\MedicalEncounters;
use App\Models\Medications;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PatientPrescriptions>
 */
class PatientPrescriptionsFactory extends Factory
{
    protected $model = \App\Models\PatientPrescriptions::class;

    private $dosageInstructions = [
        '1 tablet every 8 hours',
        '1 tablet twice daily',
        '2 tablets every 6 hours',
        '1 tablet once daily',
        '5ml every 4 hours',
        '10ml twice daily',
        '1 capsule every 12 hours',
        '2 tablets three times daily'
    ];
    
    private $frequencies = [
        'Every 8 hours', 'Twice daily', 'Every 6 hours', 'Once daily',
        'Every 4 hours', 'Three times daily', 'Every 12 hours', 'As needed'
    ];
    
    private $routes = [
        'Oral', 'Intravenous', 'Intramuscular', 'Topical', 'Inhalation',
        'Sublingual', 'Rectal', 'Nasal', 'Ophthalmic', 'Otic'
    ];
    
    private $indications = [
        'Fever', 'Pain', 'Infection', 'Hypertension', 'Diabetes',
        'Allergy', 'Cough', 'Cold', 'Headache', 'Inflammation',
        'Asthma', 'Arthritis', 'Hyperacidity', 'Insomnia', 'Anxiety'
    ];
    
    private $statuses = ['Active', 'Completed', 'Discontinued', 'On Hold'];

    public function definition(): array
    {
        $encounter = MedicalEncounters::inRandomOrder()->first();
        $prescriptionDate = $encounter->encounter_date;
        $startDate = Carbon::parse($prescriptionDate)->addDays($this->faker->numberBetween(0, 2));
        $duration = $this->faker->numberBetween(5, 30); // days
        $endDate = $startDate->copy()->addDays($duration);
        
        return [
            'prescription_id' => (string) Str::uuid(),
            'patient_id' => $encounter->patient_id,
            'encounter_id' => $encounter->encounter_id,
            'medication_id' => Medications::inRandomOrder()->first()->medication_id,
            
            'dosage' => $this->faker->randomElement($this->dosageInstructions),
            'frequency' => $this->faker->randomElement($this->frequencies),
            'route' => $this->faker->randomElement($this->routes),
            'duration' => $duration . ' days',
            
            'quantity_prescribed' => $this->faker->numberBetween(10, 100),
            'refills_allowed' => $this->faker->numberBetween(0, 3),
            
            'special_instructions' => $this->faker->optional(0.6)->randomElement([
                'Take with food', 'Take on empty stomach', 'Avoid driving', 
                'May cause drowsiness', 'Complete full course', 'Store at room temperature'
            ]),
            'indication' => $this->faker->randomElement($this->indications),
            
            'prescription_date' => $prescriptionDate,
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            
            'prescription_status' => $this->faker->randomElement($this->statuses),
        ];
    }
    
    /**
     * Create active prescription for testing
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'prescription_status' => 'Active',
            'start_date' => Carbon::parse($attributes['prescription_date'])->format('Y-m-d'),
            'end_date' => Carbon::parse($attributes['prescription_date'])->addDays(30)->format('Y-m-d'),
        ]);
    }
    
    /**
     * Create completed prescription
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'prescription_status' => 'Completed',
            'end_date' => Carbon::parse($attributes['start_date'])->subDays(1)->format('Y-m-d'),
        ]);
    }
}
