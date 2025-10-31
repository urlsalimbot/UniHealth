<?php

namespace App\Listeners;

use App\Events\LowStockDetected;
use App\Models\User;
use App\Notifications\LowStockAlert;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NotifyAdminsOfLowStock
{
    use InteractsWithQueue;
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(LowStockDetected $event): void
    {
        // Get all admins and facility staff with permission to view inventory
        $users = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['admin', 'facility_manager', 'pharmacist']);
        })->get();

        // Optionally filter by facility if you have facility-specific permissions
        // $users = User::where('facility_id', $event->inventory->facility_id)
        //     ->whereHas('roles', function ($query) {
        //         $query->whereIn('name', ['admin', 'facility_manager', 'pharmacist']);
        //     })->get();

        // Send notification to each user
        foreach ($users as $user) {
            $user->notify(new LowStockAlert($event->inventory));
        }
    }
}


