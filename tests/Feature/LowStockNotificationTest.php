<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Notification;
use App\Models\FacilityMedicationInventory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class LowStockNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_low_stock_notification_created_and_deduped_within_24h()
    {
        // create admin user
        $admin = User::factory()->create(['role' => 'administrator']);

        // create inventory record (factory or direct)
        $inventory = FacilityMedicationInventory::create([
            'facility_id' => 'FAC123',
            'medication_id' => 'MED123',
            'current_stock' => 20,
            'reorder_point' => 10,
            'minimum_stock_level' => 5,
            'maximum_stock_level' => 100,
            // include other required fields with sensible defaults...
        ]);

        // drop stock to trigger low stock (simulate update)
        $inventory->update(['current_stock' => 9]);

        // one notification should be created
        $this->assertDatabaseHas('notifications', ['type' => 'low_stock']);

        $first = Notification::where('type', 'low_stock')->count();
        $this->assertEquals(2, $first);

        // simulate another stock change in same 24 hours
        $inventory->update(['current_stock' => 8]);

        // still one notification
        $second = Notification::where('type', 'low_stock')->count();
        $this->assertEquals(2, $second);

        // simulate moving time forward >24h, and decrease again
        Carbon::setTestNow(Carbon::now()->addDays(2));
        $inventory->update(['current_stock' => 7]);

        // Now another notification should be created (total 2)
        $third = Notification::where('type', 'low_stock')->count();
        $this->assertEquals(4, $third);

        Carbon::setTestNow(); // reset
    }
}
