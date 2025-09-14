<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacilityMedicationInventory extends Model
{
    use HasFactory;
    protected $table = 'facility_medication_inventory';
    protected $primaryKey = 'inventory_id';
    public $incrementing = False;
    protected $keyType = 'string';

    protected $fillable = [
        'facility_id',
        'medication_id',
        'current_stock',
        'minimum_stock_level',
        'maximum_stock_level',
        'reorder_point',
        'lot_number',
        'expiration_date',
        'manufacturer_batch',
        'unit_cost',
        'total_value',
        'storage_location',
        'storage_conditions',
        'storage_temperature_min',
        'storage_temperature_max',
        'supplier',
        'purchase_order_number',
        'received_date',
        'received_by',
        'stock_status',
        'last_count_date',
        'last_counted_by',
        'expiry_alert_sent',
        'low_stock_alert_sent',
        'TIMESTAMP',
        'TIMESTAMP',
    ];


    public function healthcare_facilities(): BelongsTo
    {
        return $this->belongsTo(HealthcareFacilities::class, 'inventory_id');
    }

    public function medications(): BelongsTo
    {
        return $this->belongsTo(Medications::class, 'inventory_id');
    }


}
