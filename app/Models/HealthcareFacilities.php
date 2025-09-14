<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;


class HealthcareFacilities extends Model
{
    use HasFactory;
    protected $table = 'healthcare_facilities';
    protected $primaryKey = 'facility_id';
    public $incrementing = False;
    protected $keyType = 'string';

    protected $fillable = [
        'facility_code',
        'facility_name',
        'facility_type',
        'facility_level',
        'doh_license_number',
        'philhealth_accreditation',
        'facility_ownership',
        'address',
        'barangay',
        'municipality_city',
        'province',
        'region',
        'phone_number',
        'email',
        'website',
        'bed_capacity',
        'services_offered',
        'operating_hours',
        'emergency_services',
        'TIMESTAMP',
        'TIMESTAMP',
        'is_active',
    ];

    public function medical_encounters(): HasMany
    {
        return $this->hasMany(MedicalEncounters::class, 'encounter_id');
    }

    public function data_access_log(): HasMany
    {
        return $this->hasMany(DataAccessLog::class, 'log_id');
    }

    public function facility_medication_inventory(): HasMany
    {
        return $this->hasMany(FacilityMedicationInventory::class, 'inventory_id');
    }

}
