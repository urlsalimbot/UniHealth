<?php

namespace App\Models;

use App\Enums\TransactionDirection;
use App\Enums\TransactionType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class MedicationInventoryTransaction extends Model implements AuditableContract
{
    use \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'inventory_id',
        'facility_id',
        'medication_id',
        'transaction_type',
        'quantity',
        'direction',
        'remarks',
        'reference_no',
        'performed_by',
    ];

    protected $casts = [
        'transaction_type' => TransactionType::class,
        'direction' => TransactionDirection::class,
    ];

    protected $auditInclude = [
        'inventory_id',
        'facility_id',
        'medication_id',
        'transaction_type',
        'quantity',
        'direction',
        'remarks',
        'reference_no',
        'performed_by',
    ];

    public function inventory(): BelongsTo
    {
        return $this->belongsTo(FacilityMedicationInventory::class, 'inventory_id', 'inventory_id');
    }

    public function medication(): BelongsTo
    {
        return $this->belongsTo(FacilityMedicationInventory::class, 'medication_id', 'medication_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
