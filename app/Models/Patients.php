<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Str;

class Patients extends Model
{

    /** @use HasFactory<\Database\Factories\PatientsFactory> */
    use HasFactory;


    protected $table = 'patients';
    protected $primaryKey = 'patient_id';
    public $incrementing = false;   // required for UUID
    protected $keyType = 'string';
    protected $fillable = [
        'philhealth_id',
        'pwd_id',
        'senior_citizen_id',
        'last_name',
        'first_name',
        'middle_name',
        'suffix',
        'maiden_name',
        'nickname',
        'date_of_birth',
        'place_of_birth',
        'gender',
        'civil_status',
        'nationality',
        'religion',
        'mobile_number',
        'landline_number',
        'email',
        'house_number',
        'street',
        'barangay',
        'municipality_city',
        'province',
        'region',
        'postal_code',
        'emergency_contact_name',
        'emergency_contact_relationship',
        'emergency_contact_number',
        'emergency_contact_address',
        'created_by',
        'updated_by',
        'is_active',
        'data_privacy_consent',
        'created_at',
    ];


    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->patient_id)) {
                $model->patient_id = (string) Str::uuid();
            }
        });
    }

    public function medical_encounters()
    {
        return $this->hasMany(MedicalEncounters::class, 'patient_id', 'patient_id');
    }


    public function patient_prescriptions(): HasMany
    {
        return $this->hasMany(PatientPrescriptions::class, 'prescription_id');
    }

    public function vital_signs(): HasMany
    {
        return $this->hasMany(VitalSigns::class, 'vital_sign_id');
    }
}
