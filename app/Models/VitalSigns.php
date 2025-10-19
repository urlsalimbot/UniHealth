<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;


class VitalSigns extends Model
{
    protected $table = 'vital_signs';
    protected $primaryKey = 'vital_sign_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false; // migration only defines created_at (no updated_at)
    use HasFactory;


    protected $fillable = [
        'patient_id',
        'encounter_id',
        'recorded_by',
        'measurement_date',
        'measurement_time',
        'systolic_bp',
        'diastolic_bp',
        'heart_rate',
        'respiratory_rate',
        'temperature',
        'oxygen_saturation',
        'weight',
        'height',
        'bmi',
        'pain_score',
        'pain_location',
        'general_appearance',
        'mental_status',
        'bp_cuff_size',
        'thermometer_type',
        'created_at',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->vital_sign_id)) {
                $model->vital_sign_id = (string) Str::uuid();
            }
        });
    }

    /**
     * Vital sign record belongs to a patient.
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patients::class, 'patient_id', 'patient_id');
    }

    /**
     * Vital sign record belongs to a medical encounter.
     */
    public function medical_encounter(): BelongsTo
    {
        return $this->belongsTo(MedicalEncounters::class, 'encounter_id', 'encounter_id');
    }
}
