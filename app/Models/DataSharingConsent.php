<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;



use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DataSharingConsent extends Model
{
    use HasFactory;
    protected $table = 'data_sharing_consent';
    protected $primaryKey = 'consent_id';
    public $incrementing = False;
    protected $keyType = 'string';

    protected $fillable = [
        'patient_id',
        'consent_type',
        'consent_status',
        'consent_date',
        'consent_expiry_date',
        'data_categories',
        'permitted_uses',
        'restrictions',
        'legal_basis',
        'witness_name',
        'witness_signature',
        'TIMESTAMP',
        'TIMESTAMP',
    ];

    public function patients(): BelongsTo
    {
        return $this->belongsTo(Patients::class, 'consent_id');
    }

}
