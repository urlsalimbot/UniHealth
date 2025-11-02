<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use App\Events\LowStockDetected;
use Illuminate\Support\Str;

class FacilityMedicationInventory extends Model implements AuditableContract
{
    use HasFactory, Auditable;

    protected $table = 'facility_medication_inventory';
    protected $primaryKey = 'inventory_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
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
    ];

    protected $casts = [
        'current_stock' => 'integer',
        'reorder_point' => 'integer',
        'expiry_alert_sent' => 'boolean',
        'low_stock_alert_sent' => 'boolean',
        'expiration_date' => 'date',
    ];

    public const STATUS_ACTIVE = 'Active';
    public const STATUS_DISPOSED = 'Disposed';
    public const STATUS_EMPTY = 'Depleted';

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->inventory_id)) {
                // stable unique id generator
                $model->inventory_id = 'STOCK-' . (string) Str::uuid();
            }
        });

        static::updating(function ($model) {
            if ($model->isDirty('current_stock')) {
                $old = (int) $model->getOriginal('current_stock');
                $new = (int) $model->current_stock;

                if ($new <= ($model->reorder_point ?? 0)) {
                    // Fire event (listener should dedupe if necessary)
                    LowStockDetected::dispatch($model);
                }

                // If stock goes above reorder point, reset flag so future alerts can be sent
                if ($new > ($model->reorder_point ?? 0)) {
                    $model->low_stock_alert_sent = false;
                }
            }
        });
    }

    // relationships
    public function transactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class, 'inventory_id', 'inventory_id');
    }

    public function medication()
    {
        return $this->belongsTo(Medications::class, 'medication_id', 'medication_id');
    }

    public function healthcare_facilities()
    {
        return $this->belongsTo(HealthcareFacilities::class, 'facility_id', 'facility_id');
    }

    public function isLowStock(): bool
    {
        return (int) $this->current_stock <= (int) ($this->reorder_point ?? 0);
    }

    /**
     * Release stock from this inventory instance and create transaction record.
     * Uses the model's transaction relation.
     */
    public function releaseStock(int $quantity, ?int $performedBy = null, string $remarks = null, string $referenceNo = null): int
    {
        $previous = (int) $this->current_stock;
        if ($quantity <= 0) {
            throw new \InvalidArgumentException('Quantity to release must be > 0');
        }

        if ($previous < $quantity) {
            throw new \RuntimeException("Not enough stock in inventory {$this->inventory_id}");
        }

        $this->current_stock = $previous - $quantity;
        $this->save(); // will trigger updating event & low-stock event if needed

        // create transaction record
        $this->transactions()->create([
            'facility_id' => $this->facility_id,
            'medication_id' => $this->medication_id,
            'transaction_type' => \App\Enums\TransactionType::RELEASE->value,
            'quantity' => $quantity,
            'direction' => \App\Enums\TransactionDirection::OUT->value,
            'remarks' => $remarks,
            'reference_no' => $referenceNo,
            'performed_by' => $performedBy,
        ]);

        return (int) $this->current_stock;
    }
}
