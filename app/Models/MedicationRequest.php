<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use App\Enums\RequestStatus;

class MedicationRequest extends Model implements AuditableContract
{
    use HasFactory, Auditable;

    protected $fillable = ['patient_id', 'prescription_file', 'status'];
    protected $auditInclude = ['patient_id', 'prescription_file', 'status'];

    // ✅ A request belongs to one patient
    public function patient()
    {
        return $this->belongsTo(Patients::class, 'patient_id', 'patient_id');
    }

    // ✅ A request may have many items
    public function items()
    {
        return $this->hasMany(MedicationRequestItem::class);
    }

    // ✅ Optional: a reviewer (if you have such a model)
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
