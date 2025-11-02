<?php

namespace Database\Seeders;

use App\Models\HealthcareFacilities;
use App\Models\MedicalEncounters;
use App\Models\PatientPrescriptions;
use App\Models\User;
use App\Models\Patients;
use App\Models\FacilityMedicationInventory;
use App\Models\Medications;
use App\Models\VitalSigns;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with realistic historical data.
     */
    public function run(): void
    {
        // Disable foreign key checks for SQLite
        DB::statement('PRAGMA foreign_keys = OFF;');
        
        try {
            Log::info('🌱 Starting database seeding with realistic data...');
            
            // 1. Create base infrastructure first
            Log::info('📋 Creating healthcare facilities...');
            HealthcareFacilities::factory()->count(1)->create();
            
            // 2. Create patients BEFORE users (to avoid foreign key issues)
            Log::info('👨‍⚕️ Creating patients...');
            Patients::factory(100)->create();
            
            // 3. Create users with different roles (now patients exist)
            Log::info('👥 Creating users...');
            User::factory()->count(15)->create();
            
            // Create specific admin user for testing
            User::factory()->create([
                'name' => 'System Administrator',
                'email' => 'admin@unihealth.com',
                'role' => 'administrator',
            ]);
            
            // 4. Create medications
            Log::info('💊 Creating medications...');
            Medications::factory(25)->create();
            
            // 5. Create inventory with FIFO data (mix of old and new stock)
            Log::info('📦 Creating medication inventory with FIFO batches...');
            
            // Create old stock batches (for FIFO testing)
            FacilityMedicationInventory::factory(30)->oldStock()->create();
            
            // Create regular stock batches
            FacilityMedicationInventory::factory(50)->create();
            
            // Create new stock batches (for FIFO testing)
            FacilityMedicationInventory::factory(20)->newStock()->create();
            
            // Create some low stock for testing alerts
            FacilityMedicationInventory::factory(10)->lowStock()->create();
            
            // 6. Create medical encounters (historical data over past year)
            Log::info('🏥 Creating medical encounters...');
            
            // Mix of different encounter types
            MedicalEncounters::factory(150)->create();
            MedicalEncounters::factory(20)->emergency()->create();
            MedicalEncounters::factory(30)->inpatient()->create();
            MedicalEncounters::factory(50)->completed()->create();
            
            // 7. Create vital signs linked to encounters
            Log::info('📊 Creating vital signs...');
            
            VitalSigns::factory(120)->create();
            VitalSigns::factory(15)->abnormal()->create();
            VitalSigns::factory(10)->pediatric()->create();
            
            // 8. Create prescriptions linked to encounters
            Log::info('📝 Creating prescriptions...');
            
            PatientPrescriptions::factory(80)->create();
            PatientPrescriptions::factory(20)->active()->create();
            PatientPrescriptions::factory(30)->completed()->create();
            
            Log::info('✅ Database seeding completed successfully!');
            Log::info('📈 Summary:');
            Log::info('  - Patients: 100');
            Log::info('  - Users: 16 (including admin)');
            Log::info('  - Medications: 25');
            Log::info('  - Inventory Batches: 110 (with FIFO data)');
            Log::info('  - Medical Encounters: 250');
            Log::info('  - Vital Signs: 145');
            Log::info('  - Prescriptions: 130');
            
        } catch (\Exception $e) {
            Log::error('❌ Database seeding failed: ' . $e->getMessage());
            throw $e;
        } finally {
            // Re-enable foreign key checks for SQLite
            DB::statement('PRAGMA foreign_keys = ON;');
        }
    }
    
    /**
     * Create a smaller dataset for development/testing
     */
    public function runSmall(): void
    {
        DB::statement('PRAGMA foreign_keys = OFF;');
        
        try {
            Log::info('🌱 Creating small development dataset...');
            
            HealthcareFacilities::factory()->count(1)->create();
            
            // Create patients first
            Patients::factory(20)->create();
            
            // Then create users
            User::factory()->count(5)->create();
            
            User::factory()->create([
                'name' => 'Dev Admin',
                'email' => 'dev@admin.com',
                'role' => 'administrator',
            ]);
            
            Medications::factory(10)->create();
            
            // Create FIFO test data
            FacilityMedicationInventory::factory(5)->oldStock()->create();
            FacilityMedicationInventory::factory(10)->create();
            FacilityMedicationInventory::factory(3)->newStock()->create();
            
            MedicalEncounters::factory(30)->create();
            VitalSigns::factory(25)->create();
            PatientPrescriptions::factory(20)->create();
            
            Log::info('✅ Small dataset created successfully!');
            
        } catch (\Exception $e) {
            Log::error('❌ Small dataset creation failed: ' . $e->getMessage());
            throw $e;
        } finally {
            DB::statement('PRAGMA foreign_keys = ON;');
        }
    }
}
