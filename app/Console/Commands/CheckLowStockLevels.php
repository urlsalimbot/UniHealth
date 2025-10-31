<?php

namespace App\Console\Commands;

use App\Events\LowStockDetected;
use App\Models\FacilityMedicationInventory;
use Illuminate\Console\Command;

class CheckLowStockLevels extends Command
{
    protected $signature = 'inventory:check-low-stock';
    protected $description = 'Check for low stock levels and send notifications';

    public function handle()
    {
        $lowStockItems = FacilityMedicationInventory::where('stock_status', '!=', FacilityMedicationInventory::STATUS_DISPOSED)
            ->whereRaw('current_stock <= reorder_point')
            ->where('low_stock_alert_sent', false)
            ->get();

        $count = 0;
        foreach ($lowStockItems as $item) {
            LowStockDetected::dispatch($item);
            $item->update(['low_stock_alert_sent' => true]);
            $count++;
        }

        $this->info("Low stock notifications sent for {$count} items.");
    }
}
