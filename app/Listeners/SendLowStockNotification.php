<?php

namespace App\Listeners;

use App\Events\LowStockDetected;
use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue; // optional
use Illuminate\Queue\InteractsWithQueue;

class SendLowStockNotification implements ShouldQueue
{
    use InteractsWithQueue; // uncomment if implementing ShouldQueue

    /**
     * Handle the event.
     */
    public function handle(LowStockDetected $event): void
    {
        $inventory = $event->inventory;

        // Safety guards so listener doesn't fatally error if relations missing
        $facility = $inventory->healthcare_facilities ?? null;
        $medication = $inventory->medication ?? null;

        $facilityName = $facility->facility_name ?? 'Unknown Facility';
        // medication name fallback — change to your actual attribute if different
        $medName = $medication->name ?? ($inventory->medication_id ?? 'Medication');

        // Build message / title exactly as we'll search for them (keep format consistent)
        $title = "Low Stock Alert: {$medName}";
        $message = "Stock for {$medName} in {$facilityName} has dropped to {$inventory->current_stock} (Reorder point: {$inventory->reorder_point}).";

        // Dedup criteria: same 'type' + a title match + created_at within last 24 hours
        $since = Carbon::now()->subDay();

        $recentNotificationExists = Notification::where('type', 'low_stock')
            ->where('title', $title)
            ->where('created_at', '>=', $since)
            ->exists();

        if ($recentNotificationExists) {
            // Already notified in last 24 hours for same medication name
            return;
        }

        // Create the notification row
        $notification = Notification::create([
            'user_id' => null, // null = global / non-specific. Change if you want it assigned.
            'role' => 'administrator', // adjust to match your viewer filtering logic
            'is_global' => true,
            'type' => 'low_stock',
            'title' => $title,
            'message' => $message,
            'action_url' => route('inventory.item.show', $inventory->inventory_id ?? $inventory->medication_id),
        ]);

        $notification = Notification::create([
            'user_id' => null, // null = global / non-specific. Change if you want it assigned.
            'role' => 'inventoy-staff', // adjust to match your viewer filtering logic
            'is_global' => true,
            'type' => 'low_stock',
            'title' => $title,
            'message' => $message,
            'action_url' => route('inventory.item.show', $inventory->inventory_id ?? $inventory->medication_id),
        ]);

        // Attach viewers (administrators) to pivot without duplicating existing attachments
        $adminIds = User::where('role', 'administrator')->pluck('id')->toArray();

        if (!empty($adminIds)) {
            $attach = [];
            foreach ($adminIds as $id) {
                $attach[$id] = ['is_viewed' => false, 'created_at' => now(), 'updated_at' => now()];
            }
            $notification->viewers()->syncWithoutDetaching($attach);
        }
    }
}
