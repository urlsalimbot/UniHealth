<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class MedicationRequest extends Model implements AuditableContract
{

    use HasFactory, Auditable;

    protected $fillable = [
        'patient_id',
        'prescription_file',
        'mime_type',
        'status',
        'reviewed_by',
        'reviewed_at',
    ];
    protected $auditInclude = [
        'patient_id',
        'prescription_file',
        'mime_type',
        'status',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
