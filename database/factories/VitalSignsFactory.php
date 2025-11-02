<?php

namespace Database\Factories;

use App\Models\MedicalEncounters;
use App\Models\Patients;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VitalSigns>
 */
class VitalSignsFactory extends Factory
{
    protected $model = \App\Models\VitalSigns::class;

    private $bpCuffSizes = ['Small', 'Regular', 'Large', 'Extra Large'];
    private $thermometerTypes = ['Digital Oral', 'Tympanic', 'Temporal', 'Rectal', 'Axillary'];
    private $painLocations = [
        'Head', 'Chest', 'Abdomen', 'Back', 'Joints', 'Extremities',
        'Neck', 'Shoulder', 'Generalized'
    ];
    private $generalAppearances = [
        'Alert and oriented', 'Well-nourished', 'Appears healthy',
        'Mildly distressed', 'Comfortable', 'No acute distress',
        'Alert and responsive', 'Cooperative', 'Anxious but alert'
    ];
    private $mentalStatuses = [
        'Alert and oriented x3', 'Alert and oriented x4', 'Coherent',
        'Appropriate responses', 'Follows commands', 'Oriented to time and place',
        'Alert and responsive', 'Clear speech', 'Normal thought process'
    ];

    public function definition(): array
    {
        $encounter = MedicalEncounters::inRandomOrder()->first();
        $encounterDate = $encounter->encounter_date;
        
        // Generate medically accurate vital signs
        $systolic = $this->faker->numberBetween(90, 180);
        $diastolic = $this->faker->numberBetween(60, 110);
        $heartRate = $this->faker->numberBetween(60, 100);
        $respiratoryRate = $this->faker->numberBetween(12, 20);
        $temperature = $this->faker->randomFloat(1, 36.0, 38.5);
        $oxygenSaturation = $this->faker->numberBetween(95, 100);
        
        // Weight and height with BMI calculation
        $weight = $this->faker->randomFloat(1, 40.0, 120.0); // kg
        $height = $this->faker->randomFloat(1, 140.0, 200.0); // cm
        $bmi = round($weight / pow($height / 100, 2), 1);
        
        return [
            'vital_sign_id' => (string) Str::uuid(),
            'patient_id' => $encounter->patient_id,
            'encounter_id' => $encounter->encounter_id,
            'recorded_by' => User::whereIn('role', ['administrator', 'doctor', 'intake-staff', 'nurse'])->inRandomOrder()->first()->name,
            
            'measurement_date' => $encounterDate,
            'measurement_time' => sprintf(
                '%02d:%02d',
                $this->faker->numberBetween(8, 18),
                $this->faker->numberBetween(0, 59)
            ),
            
            // Blood Pressure (medically accurate ranges)
            'systolic_bp' => $systolic,
            'diastolic_bp' => $diastolic,
            
            // Heart Rate (beats per minute)
            'heart_rate' => $heartRate,
            
            // Respiratory Rate (breaths per minute)
            'respiratory_rate' => $respiratoryRate,
            
            // Temperature (Celsius)
            'temperature' => $temperature,
            
            // Oxygen Saturation (%)
            'oxygen_saturation' => $oxygenSaturation,
            
            // Weight (kg)
            'weight' => $weight,
            
            // Height (cm)
            'height' => $height,
            
            // BMI (calculated)
            'bmi' => $bmi,
            
            // Pain Assessment
            'pain_score' => $this->faker->numberBetween(0, 10),
            'pain_location' => $this->faker->optional(0.7)->randomElement($this->painLocations),
            
            // Physical Assessment
            'general_appearance' => $this->faker->randomElement($this->generalAppearances),
            'mental_status' => $this->faker->randomElement($this->mentalStatuses),
            
            // Equipment Used
            'bp_cuff_size' => $this->faker->randomElement($this->bpCuffSizes),
            'thermometer_type' => $this->faker->randomElement($this->thermometerTypes),
        ];
    }
    
    /**
     * Create vital signs with abnormal values for testing
     */
    public function abnormal(): static
    {
        return $this->state(fn (array $attributes) => [
            'systolic_bp' => $this->faker->numberBetween(140, 200),
            'diastolic_bp' => $this->faker->numberBetween(90, 120),
            'heart_rate' => $this->faker->numberBetween(100, 140),
            'temperature' => $this->faker->randomFloat(1, 38.0, 40.5),
            'oxygen_saturation' => $this->faker->numberBetween(85, 94),
            'pain_score' => $this->faker->numberBetween(7, 10),
        ]);
    }
    
    /**
     * Create vital signs for pediatric patients
     */
    public function pediatric(): static
    {
        return $this->state(fn (array $attributes) => [
            'systolic_bp' => $this->faker->numberBetween(80, 120),
            'diastolic_bp' => $this->faker->numberBetween(50, 80),
            'heart_rate' => $this->faker->numberBetween(80, 140),
            'respiratory_rate' => $this->faker->numberBetween(20, 30),
            'weight' => $this->faker->randomFloat(1, 10.0, 40.0),
            'height' => $this->faker->randomFloat(1, 80.0, 150.0),
        ]);
    }
}
