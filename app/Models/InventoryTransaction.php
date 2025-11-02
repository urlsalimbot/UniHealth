<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InventoryTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'facility_medication_inventory_id',
        'transaction_type',
        'quantity',
        'previous_stock',
        'new_stock',
        'reference',
        'remarks',
        'performed_by',
    ];

    // Relationships
    public function inventory()
    {
        return $this->belongsTo(FacilityMedicationInventory::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'performed_by');
    }

    // Accessor to compute difference
    public function getStockChangeAttribute()
    {
        return $this->new_stock - $this->previous_stock;
    }
}
