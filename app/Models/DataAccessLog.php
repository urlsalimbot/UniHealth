<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DataAccessLog extends Model
{
    use HasFactory;
    protected $table = 'data_access_log';
    protected $primaryKey = 'log_id';
    public $incrementing = False;
    protected $keyType = 'string';

    protected $fillable = [
        'patient_id',
        'accessed_by',
        'facility_id',
        'access_date',
        'access_time',
        'access_type',
        'table_accessed',
        'record_id',
        'INET',
        'user_agent',
        'session_id',
        'access_purpose',
        'justification',
        'TIMESTAMP',
    ];

    public function patients(): BelongsTo
    {
        return $this->belongsTo(Patients::class, 'log_id');
    }

    public function healthcare_facilities(): BelongsTo
    {
        return $this->belongsTo(HealthcareFacilities::class, 'log_id');
    }
}
