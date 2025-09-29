<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class PatientPrescriptions extends Model
{
    public $timestamps = false;
    protected $table = 'patient_prescriptions';
    protected $primaryKey = 'prescription_id';
    public $incrementing = false;
    protected $keyType = 'string';
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'encounter_id',
        'medication_id',
        'dosage',
        'frequency',
        'route',
        'duration',
        'quantity_prescribed',
        'refills_allowed',
        'special_instructions',
        'indication',
        'prescription_date',
        'start_date',
        'end_date',
        'prescription_status',
        'created_at',
    ];

    /**
     * A prescription belongs to a patient.
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patients::class, 'patient_id', 'patient_id');
    }

    /**
     * A prescription belongs to a medical encounter.
     */
    public function medical_encounter(): BelongsTo
    {
        return $this->belongsTo(MedicalEncounters::class, 'encounter_id', 'encounter_id');
    }

    /**
     * A prescription belongs to a medication.
     */
    public function medication(): BelongsTo
    {
        return $this->belongsTo(Medications::class, 'medication_id', 'medication_id');
    }
}
