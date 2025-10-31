<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use \OwenIt\Auditing\Auditable;

class FacilityMedicationInventory extends Model implements AuditableContract
{
    use HasFactory, Auditable;

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
        'created_at',
    ];

    protected $auditInclude = [
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
        'created_at',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->inventory_id)) {
                do {
                    $id = 'STOCK' . rand(100, 999999);
                } while (self::where('inventory_id', $id)->exists());

                $model->inventory_id = $id;
            }
        });
    }


    public function healthcare_facilities(): BelongsTo
    {
        return $this->belongsTo(HealthcareFacilities::class, 'facility_id', 'facility_id');
    }

    public function medication()
    {
        return $this->belongsTo(Medications::class, 'medication_id', 'medication_id');
    }

    public function transactions()
    {
        return $this->hasMany(MedicationInventoryTransaction::class, 'inventory_id', 'inventory_id');
    }

}
