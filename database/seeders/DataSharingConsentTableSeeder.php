<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DataSharingConsent;

class DataSharingConsentTableSeeder extends Seeder
{
    public function run(): void
    {
        DataSharingConsent::factory()->count(10)->create();
    }
}
