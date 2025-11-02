<?php

namespace Database\Factories;

use App\Models\HealthcareFacilities;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Patients;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MedicalEncounters>
 */
class MedicalEncountersFactory extends Factory
{
    protected $model = \App\Models\MedicalEncounters::class;

    private $encounterTypes = [
        'Consultation', 'Follow-up', 'Emergency', 'Procedure',
        'Vaccination', 'Laboratory', 'Imaging', 'Check-up',
        'Specialist Referral', 'Pre-employment', 'Annual Physical'
    ];
    
    private $encounterClasses = [
        'Outpatient', 'Inpatient', 'Emergency', 'Day Surgery',
        'Observation', 'Home Visit', 'Telemedicine'
    ];
    
    private $chiefComplaints = [
        'Fever and cough', 'Headache', 'Abdominal pain', 'Chest pain',
        'Difficulty breathing', 'Back pain', 'Joint pain', 'Skin rash',
        'Dizziness', 'Nausea and vomiting', 'Fatigue', 'Insomnia',
        'High blood pressure', 'Diabetes follow-up', 'Wound care'
    ];
    
    private $interventions = [
        'Medication prescribed', 'Laboratory tests ordered', 'Vital signs monitored',
        'Wound dressing', 'IV fluids administered', 'Health education provided',
        'Referral to specialist', 'Procedure performed', 'Observation',
        'Discharge planning', 'Counseling provided', 'Vaccination given'
    ];
    
    private $statuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'No Show'];

    public function definition(): array
    {
        $encounterDate = $this->faker->dateTimeBetween('-1 year', 'now');
        $encounterTime = $this->faker->dateTimeBetween('08:00', '17:00');
        $isAdmission = $this->faker->boolean(20); // 20% chance of admission
        
        return [
            'encounter_id' => (string) Str::uuid(),
            'patient_id' => Patients::inRandomOrder()->first()->patient_id,
            'facility_id' => HealthcareFacilities::inRandomOrder()->first()->facility_id,
            
            'encounter_type' => $this->faker->randomElement($this->encounterTypes),
            'encounter_class' => $this->faker->randomElement($this->encounterClasses),
            'chief_complaint' => $this->faker->randomElement($this->chiefComplaints),
            'intervention' => $this->faker->randomElement($this->interventions),
            
            'encounter_date' => $encounterDate->format('Y-m-d'),
            'encounter_time' => $encounterTime->format('H:i:s'),
            
            'admission_date' => $isAdmission ? $encounterDate->format('Y-m-d') : null,
            'discharge_date' => $isAdmission ? 
                Carbon::parse($encounterDate)->addDays($this->faker->numberBetween(1, 7))->format('Y-m-d') : null,
            
            'encounter_status' => $this->faker->randomElement($this->statuses),
            'created_by' => User::whereIn('role', ['administrator', 'doctor', 'staff'])->inRandomOrder()->first()->name,
        ];
    }
    
    /**
     * Create emergency encounter
     */
    public function emergency(): static
    {
        return $this->state(fn (array $attributes) => [
            'encounter_type' => 'Emergency',
            'encounter_class' => 'Emergency',
            'chief_complaint' => $this->faker->randomElement(['Chest pain', 'Difficulty breathing', 'Severe injury', 'Unconscious']),
            'encounter_time' => $this->faker->dateTimeBetween('00:00', '23:59')->format('H:i:s'),
        ]);
    }
    
    /**
     * Create inpatient encounter
     */
    public function inpatient(): static
    {
        return $this->state(fn (array $attributes) => [
            'encounter_class' => 'Inpatient',
            'admission_date' => $attributes['encounter_date'],
            'discharge_date' => Carbon::parse($attributes['encounter_date'])->addDays($this->faker->numberBetween(2, 14))->format('Y-m-d'),
        ]);
    }
    
    /**
     * Create completed encounter
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'encounter_status' => 'Completed',
        ]);
    }
}
