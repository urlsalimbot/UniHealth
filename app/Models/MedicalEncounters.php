<?php

    namespace App\Models;

    use Illuminate\Database\Eloquent\Model;
    use Illuminate\Database\Eloquent\Relations\HasMany;
    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Relations\BelongsTo;

    class MedicalEncounters extends Model
    {
        use HasFactory;

        protected $table = 'medical_encounters';
        protected $primaryKey = 'encounter_id';
        public $incrementing = false;
        protected $keyType = 'string';

        protected $fillable = [
            'patient_id',
            'facility_id',
            'attending_provider_id',
            'encounter_type',
            'encounter_class',
            'chief_complaint',
            'encounter_date',
            'encounter_time',
            'admission_date',
            'discharge_date',
            'encounter_status',
            'created_by',
        ];

        /** 
         * A medical encounter has many prescriptions.
         */
        public function patient_prescriptions(): HasMany
        {
            return $this->hasMany(PatientPrescriptions::class, 'encounter_id', 'encounter_id');
        }

        /** 
         * A medical encounter has many vital signs records.
         */
        public function vital_signs(): HasMany
        {
            return $this->hasMany(VitalSigns::class, 'encounter_id', 'encounter_id');
        }

        /** 
         * A medical encounter belongs to a patient.
         */
        public function patient(): BelongsTo
        {
            return $this->belongsTo(Patients::class, 'patient_id', 'patient_id');
        }

        /** 
         * A medical encounter belongs to a healthcare facility.
         */
        public function healthcare_facility(): BelongsTo
        {
            return $this->belongsTo(HealthcareFacilities::class, 'facility_id', 'facility_id');
        }
    }
