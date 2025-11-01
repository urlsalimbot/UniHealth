<?php

namespace App\Events;

use App\Models\FacilityMedicationInventory;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LowStockDetected
{
    use Dispatchable, SerializesModels;

    public FacilityMedicationInventory $inventory;

    public function __construct(FacilityMedicationInventory $inventory)
    {
        $this->inventory = $inventory;
    }
}