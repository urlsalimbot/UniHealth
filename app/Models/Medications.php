<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Medications extends Model
{
    protected $table = 'medications';
    protected $primaryKey = 'medication_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false; // migration only defines created_at

    protected $fillable = [
        'generic_name',
        'brand_names',
        'strength',
        'dosage_form',
        'drug_class',
        'controlled_substance',
        'fda_registration',
        'created_at',
    ];

    /**
     * A medication can appear in many prescriptions.
     */
    public function patient_prescriptions(): HasMany
    {
        return $this->hasMany(PatientPrescriptions::class, 'medication_id', 'medication_id');
    }

    /**
     * A medication can appear in many facility inventory records.
     */
    public function facility_medication_inventory(): HasMany
    {
        return $this->hasMany(FacilityMedicationInventory::class, 'medication_id', 'medication_id');
    }
}
