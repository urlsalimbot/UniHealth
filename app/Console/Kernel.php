<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application’s command schedule.
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('inventory:check-low-stock')
            ->dailyAt('09:00')
            ->withoutOverlapping();
    }


    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');
    }
}
