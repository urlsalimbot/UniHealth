<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Medications;
use App\Models\HealthcareFacilities;
use Illuminate\Support\Str;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FacilityMedicationInventory>
 */
class FacilityMedicationInventoryFactory extends Factory
{
    protected $model = \App\Models\FacilityMedicationInventory::class;

    private $suppliers = [
        'United Laboratories', 'Pascual Laboratories', 'RiteMed', 'Pharex Health',
        'MediExpress', 'Bio-Meds', 'InterMed', 'HealthSolutions', 'PharmaPlus',
        'MediCore', 'Wellness Pharma', 'CareMed', 'HealthLink', 'MediSupply'
    ];
    
    private $storageLocations = [
        'Pharmacy-A1', 'Pharmacy-A2', 'Pharmacy-B1', 'Pharmacy-B2',
        'Storage-Room-1', 'Storage-Room-2', 'Cold-Storage-1', 'Cold-Storage-2',
        'Emergency-Pharmacy', 'Outpatient-Pharmacy', 'Inpatient-Pharmacy'
    ];
    
    private $storageConditions = [
        'Room Temperature', 'Refrigerated', 'Climate Controlled', 
        'Dry Storage', 'Temperature Monitored', 'Humidity Controlled'
    ];

    public function definition(): array
    {
        $receivedDate = $this->faker->dateTimeBetween('-2 years', '-1 week');
        $expirationDate = $this->faker->dateTimeBetween('+6 months', '+3 years');
        $currentStock = $this->faker->numberBetween(10, 500);
        $unitCost = $this->faker->randomFloat(2, 1.50, 500.00);
        
        return [
            'inventory_id' => 'STOCK-' . str_pad($this->faker->unique()->numberBetween(1, 99999), 5, '0', STR_PAD_LEFT),
            'facility_id' => HealthcareFacilities::inRandomOrder()->first()->facility_id,
            'medication_id' => Medications::inRandomOrder()->first()->medication_id,
            
            'current_stock' => $currentStock,
            'minimum_stock_level' => max(10, $currentStock * 0.2), // 20% of current
            'maximum_stock_level' => $currentStock * 2, // 2x current
            'reorder_point' => max(15, $currentStock * 0.25), // 25% of current
            
            'lot_number' => 'LOT-' . strtoupper($this->faker->lexify('????')) . '-' . $this->faker->numerify('####'),
            'expiration_date' => $expirationDate->format('Y-m-d'),
            'manufacturer_batch' => 'MB-' . $this->faker->numerify('########'),
            
            'unit_cost' => $unitCost,
            'total_value' => round($currentStock * $unitCost, 2),
            
            'storage_location' => $this->faker->randomElement($this->storageLocations),
            'storage_conditions' => $this->faker->randomElement($this->storageConditions),
            'storage_temperature_min' => $this->faker->randomFloat(1, 15.0, 25.0),
            'storage_temperature_max' => $this->faker->randomFloat(1, 25.0, 30.0),
            
            'supplier' => $this->faker->randomElement($this->suppliers),
            'purchase_order_number' => 'PO-' . $this->faker->numerify('########'),
            'received_date' => $receivedDate->format('Y-m-d'),
            'received_by' => $this->faker->name(),
            
            'stock_status' => \App\Models\FacilityMedicationInventory::STATUS_ACTIVE,
            'last_count_date' => $this->faker->dateTimeBetween($receivedDate, 'now')->format('Y-m-d'),
            'last_counted_by' => $this->faker->name(),
            'expiry_alert_sent' => false,
            'low_stock_alert_sent' => $currentStock <= 50 ? $this->faker->boolean(30) : false, // 30% chance if low stock
        ];
    }
    
    /**
     * Create old stock for FIFO testing
     */
    public function oldStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'received_date' => $this->faker->dateTimeBetween('-2 years', '-6 months')->format('Y-m-d'),
            'expiration_date' => $this->faker->dateTimeBetween('+1 month', '+6 months')->format('Y-m-d'),
            'lot_number' => 'OLD-' . strtoupper($this->faker->lexify('????')) . '-' . $this->faker->numerify('####'),
        ]);
    }
    
    /**
     * Create new stock for FIFO testing
     */
    public function newStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'received_date' => $this->faker->dateTimeBetween('-1 month', '-1 week')->format('Y-m-d'),
            'expiration_date' => $this->faker->dateTimeBetween('+2 years', '+4 years')->format('Y-m-d'),
            'lot_number' => 'NEW-' . strtoupper($this->faker->lexify('????')) . '-' . $this->faker->numerify('####'),
        ]);
    }
    
    /**
     * Create low stock for testing alerts
     */
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'current_stock' => $this->faker->numberBetween(5, 20),
            'minimum_stock_level' => 25,
            'reorder_point' => 30,
        ]);
    }
}
