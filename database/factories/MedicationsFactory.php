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
    protected $model = Medications::class;

    // Realistic medication data for Philippine healthcare
    private $genericNames = [
        'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Metformin', 'Amlodipine', 'Losartan', 
        'Simvastatin', 'Omeprazole', 'Salbutamol', 'Cetirizine', 'Ascorbic Acid', 'Multivitamins',
        'Hydrochlorothiazide', 'Gliclazide', 'Atorvastatin', 'Ranitidine', 'Dextromethorphan',
        'Carbocisteine', 'Ambroxol', 'Mefenamic Acid', 'Diclofenac', 'Ciprofloxacin',
        'Clindamycin', 'Azithromycin', 'Levothyroxine', 'Furosemide', 'Spironolactone'
    ];
    
    private $brandNames = [
        'Biogesic', 'Advil', 'Amoxil', 'Diabex', 'Norvasc', 'Cozaar', 'Zocor', 'Losec',
        'Ventolin', 'Zyrtec', 'Poten-Cee', 'Enervon', 'HydroDIURIL', 'Diamicron', 'Lipitor',
        'Zantac', 'Robitussin', 'Solmux', 'Mefenamic', 'Voltaren', 'Cipro', 'Cleocin',
        'Zithromax', 'Euthyrox', 'Lasix', 'Aldactone'
    ];
    
    private $drugClasses = [
        'Analgesic', 'Antipyretic', 'Antibiotic', 'Antidiabetic', 'Antihypertensive',
        'Statins', 'Proton Pump Inhibitor', 'Bronchodilator', 'Antihistamine',
        'Vitamins', 'Diuretic', 'Antitussive', 'Mucolytic', 'NSAID', 'Thyroid Hormone'
    ];
    
    private $dosageForms = [
        'Tablet', 'Capsule', 'Syrup', 'Suspension', 'Injection', 'Ointment', 'Cream',
        'Drops', 'Inhaler', 'Patch', 'Gel', 'Suppository'
    ];
    
    private $strengths = [
        '500mg', '250mg', '100mg', '50mg', '10mg', '5mg', '20mg', '40mg', '80mg',
        '160mg', '200mg', '400mg', '600mg', '800mg', '1000mg', '125mg', '375mg',
        '75mg', '150mg', '300mg', '450mg', '2mg', '4mg', '8mg', '16mg', '32mg',
        '50mcg', '100mcg', '200mcg', '25mcg', '75mcg', '125mcg'
    ];

    public function definition(): array
    {
        $genericName = $this->faker->randomElement($this->genericNames);
        $isControlled = in_array($genericName, ['Ciprofloxacin', 'Clindamycin', 'Azithromycin']);
        
        return [
            'medication_id' => 'MED-' . str_pad($this->faker->unique()->numberBetween(1, 9999), 4, '0', STR_PAD_LEFT),
            'generic_name' => $genericName,
            'brand_names' => $this->faker->randomElement($this->brandNames),
            'strength' => $this->faker->randomElement($this->strengths),
            'dosage_form' => $this->faker->randomElement($this->dosageForms),
            'drug_class' => $this->faker->randomElement($this->drugClasses),
            'controlled_substance' => $isControlled,
            'fda_registration' => 'FDA-' . $this->faker->numerify('########'),
        ];
    }
}
