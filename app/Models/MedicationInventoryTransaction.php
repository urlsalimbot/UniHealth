<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicationInventoryTransaction extends Model
{
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

    public function inventory(): BelongsTo
    {
        return $this->belongsTo(FacilityMedicationInventory::class, 'inventory_id', 'inventory_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
