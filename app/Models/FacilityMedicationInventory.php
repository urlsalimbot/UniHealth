<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Auditable;
use App\Events\LowStockDetected;

class FacilityMedicationInventory extends Model implements AuditableContract
{
    use HasFactory, Auditable;

    protected $table = 'facility_medication_inventory';
    protected $primaryKey = 'inventory_id';
    public $incrementing = false;
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
        'inventory_id',
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

    public const STATUS_ACTIVE = 'Active';
    public const STATUS_DISPOSED = 'Disposed';
    public const STATUS_EMPTY = 'Depleted';

    // Boot method to dispatch events on update
    protected static function boot()
    {
        parent::boot();

        static::updating(function ($model) {
            if ($model->isDirty('current_stock')) {
                $oldStock = $model->getOriginal('current_stock');
                $newStock = $model->current_stock;

                // When stock goes below or equal reorder point
                if ($newStock <= $model->reorder_point) {
                    // fire event regardless of flag; listener dedupes within 24h
                    LowStockDetected::dispatch($model);
                }

                // Reset alert flag when it goes back above reorder point (optional)
                if ($newStock > $model->reorder_point) {
                    $model->low_stock_alert_sent = false;
                }
            }
        });

        static::creating(function ($model) {
            if (empty($model->inventory_id)) {
                do {
                    $id = 'STOCK' . rand(100, 999999);
                } while (self::where('inventory_id', $id)->exists());
                $model->inventory_id = $id;
            }
        });
    }

    public function isLowStock(): bool
    {
        return $this->current_stock <= $this->reorder_point;
    }

    public function scopeLowStock($query)
    {
        return $query->whereColumn('current_stock', '<=', 'reorder_point');
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

    public function markAsDisposed(string $remarks = null): void
    {
        $this->update([
            'current_stock' => 0,
            'stock_status' => self::STATUS_DISPOSED,
            'remarks' => $remarks ?? 'Disposed due to expiry',
        ]);

        $this->transactions()->create([
            'facility_id' => $this->facility_id,
            'medication_id' => $this->medication_id,
            'transaction_type' => 'DISPOSAL',
            'direction' => 'OUT',
            'quantity' => 0,
            'remarks' => $remarks ?? 'Expired stock disposed',
            'performed_by' => auth()->id(),
        ]);
    }

    public function markAsDepleted(string $remarks = null): void
    {
        $this->update([
            'current_stock' => 0,
            'stock_status' => self::STATUS_EMPTY,
            'remarks' => $remarks ?? 'Stock naturally depleted',
        ]);

        $this->transactions()->create([
            'facility_id' => $this->facility_id,
            'medication_id' => $this->medication_id,
            'transaction_type' => 'ADJUSTMENT',
            'direction' => 'OUT',
            'quantity' => 0,
            'remarks' => $remarks ?? 'Stock zeroed out manually',
            'performed_by' => auth()->id(),
        ]);
    }
}
