<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Facility_medication_inventory;
use Illuminate\Support\Str;

class Facility_medication_inventoryFactory extends Factory
{
    protected $model = Facility_medication_inventory::class;

    public function definition(): array
    {
        return [
            'inventory_id' => (string) Str::uuid(),
            'facility_id' => (string) Str::uuid(),
            'medication_id' => (string) Str::uuid(),
            'current_stock' => $this->faker->randomNumber(),
            'minimum_stock_level' => $this->faker->randomNumber(),
            'maximum_stock_level' => $this->faker->randomNumber(),
            'reorder_point' => $this->faker->randomNumber(),
            'lot_number' => $this->faker->word(),
            'expiration_date' => $this->faker->date(),
            'manufacturer_batch' => $this->faker->word(),
            'unit_cost' => $this->faker->randomFloat(2, 0, 9999),
            'total_value' => $this->faker->randomFloat(2, 0, 9999),
            'storage_location' => $this->faker->word(),
            'storage_conditions' => $this->faker->word(),
            'storage_temperature_min' => $this->faker->randomFloat(2, 0, 9999),
            'storage_temperature_max' => $this->faker->randomFloat(2, 0, 9999),
            'supplier' => $this->faker->word(),
            'purchase_order_number' => $this->faker->word(),
            'received_date' => $this->faker->date(),
            'received_by' => (string) Str::uuid(),
            'stock_status' => $this->faker->word(),
            'last_count_date' => $this->faker->date(),
            'last_counted_by' => (string) Str::uuid(),
            'expiry_alert_sent' => $this->faker->boolean(),
            'low_stock_alert_sent' => $this->faker->boolean(),
        ];
    }
}
