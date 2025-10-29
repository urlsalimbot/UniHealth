<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use OwenIt\Auditing\Contracts\Auditable;

class Medications extends Model implements Auditable
{

    use \OwenIt\Auditing\Auditable;
    protected $table = 'medications';
    protected $primaryKey = 'medication_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false; // migration only defines created_at
    use hasFactory;

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
    protected $auditInclude = [
        'generic_name',
        'brand_names',
        'strength',
        'dosage_form',
        'drug_class',
        'controlled_substance',
        'fda_registration',
        'created_at',
    ];


    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->medication_id)) {
                do {
                    $id = 'MED' . rand(100, 999);
                } while (self::where('medication_id', $id)->exists());

                $model->medication_id = $id;
            }
        });
    }
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
