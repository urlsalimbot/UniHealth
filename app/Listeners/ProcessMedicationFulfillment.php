<?php

namespace App\Listeners;

use App\Events\LowStockDetected;
use App\Events\MedicationFulfilled;
use App\Models\FacilityMedicationInventory;
use App\Models\InventoryTransaction;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\MedicationRequestFulfilledMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessMedicationFulfillment implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Handle the event with FIFO stock depletion.
     */
    public function handle(MedicationFulfilled $event)
    {
        $request = $event->request;

        // Always handle fulfillment atomically
        DB::beginTransaction();

        try {
            // ✅ Step 1: Validate and allocate stock using FIFO
            $stockAllocations = [];
            $failedItems = [];

            foreach ($request->items as $item) {
                try {
                    $allocation = $this->allocateFifoStock($item->medication_id, $item->quantity);
                    
                    if ($allocation['sufficient']) {
                        $stockAllocations[] = [
                            'medication_id' => $item->medication_id,
                            'required_quantity' => $item->quantity,
                            'batches' => $allocation['batches']
                        ];
                    } else {
                        $failedItems[] = [
                            'medication_id' => $item->medication_id,
                            'reason' => 'Insufficient stock',
                            'required' => $item->quantity,
                            'available' => $allocation['total_available'],
                            'batches_available' => count($allocation['available_batches'])
                        ];
                    }
                } catch (\Exception $e) {
                    $failedItems[] = [
                        'medication_id' => $item->medication_id,
                        'reason' => 'Error allocating stock: ' . $e->getMessage(),
                        'required' => $item->quantity,
                        'available' => 0
                    ];
                }
            }

            // If any items failed, reject the entire request
            if (!empty($failedItems)) {
                $failureReasons = array_map(function($failure) {
                    return "{$failure['medication_id']}: {$failure['reason']} (required: {$failure['required']}, available: {$failure['available']})";
                }, $failedItems);

                Log::warning("❌ MedicationRequest#{$request->id} rejected due to stock issues: " . implode('; ', $failureReasons));

                // Notify admins and inventory staff about all failed items
                $this->notifyAdminsAndStaff($failedItems, $request);

                // Mark the request as rejected
                $request->update([
                    'status' => 'rejected',
                    'rejection_reason' => implode('; ', $failureReasons),
                ]);

                DB::commit();
                return;
            }

            // ✅ Step 2: Execute FIFO stock depletion and record transactions
            foreach ($stockAllocations as $allocation) {
                $medicationId = $allocation['medication_id'];
                $requiredQuantity = $allocation['required_quantity'];
                $batches = $allocation['batches'];

                Log::info("📦 Depleting FIFO stock for {$medicationId}: {$requiredQuantity} units from " . count($batches) . " batches");

                foreach ($batches as $batch) {
                    $inventory = $batch['inventory'];
                    $depletionAmount = $batch['depletion_amount'];
                    $previousStock = $batch['previous_stock'];

                    // Lock this specific inventory batch
                    $lockedInventory = FacilityMedicationInventory::where('inventory_id', $inventory->inventory_id)
                        ->lockForUpdate()
                        ->first();

                    // Double-check stock is still available
                    if ($lockedInventory->current_stock < $depletionAmount) {
                        throw new \Exception("Stock changed during fulfillment for batch {$inventory->inventory_id}");
                    }

                    // Deplete the stock
                    $lockedInventory->current_stock = $previousStock - $depletionAmount;
                    $lockedInventory->save();

                    // Create transaction record
                    try {
                        InventoryTransaction::create([
                            'facility_medication_inventory_id' => $lockedInventory->inventory_id,
                            'transaction_type' => 'release',
                            'quantity' => $depletionAmount,
                            'previous_stock' => $previousStock,
                            'new_stock' => $lockedInventory->current_stock,
                            'reference' => 'MedicationRequest#' . $request->id,
                            'remarks' => "FIFO fulfillment: Lot {$inventory->lot_number} (Exp: {$inventory->expiration_date}) for patient {$request->patient_id}",
                            'performed_by' => $request->approved_by ?? auth()->id(),
                        ]);
                    } catch (\Exception $e) {
                        Log::error("❌ Failed to create inventory transaction for batch {$inventory->inventory_id}: " . $e->getMessage());
                        throw $e;
                    }

                    // Check for low stock after depletion
                    if ($lockedInventory->current_stock <= $lockedInventory->reorder_point) {
                        Log::info("🚨 Low stock detected for batch {$inventory->inventory_id} (Lot: {$inventory->lot_number}): {$lockedInventory->current_stock} remaining");
                        event(new LowStockDetected($lockedInventory));
                    }

                    // Update batch status if depleted
                    if ($lockedInventory->current_stock <= 0) {
                        $lockedInventory->stock_status = FacilityMedicationInventory::STATUS_EMPTY;
                        $lockedInventory->save();
                        Log::info("📋 Batch {$inventory->inventory_id} (Lot: {$inventory->lot_number}) marked as depleted");
                    }
                }
            }

            // ✅ Step 3: Mark request as fulfilled
            $request->update(['status' => 'fulfilled', 'fulfilled_at' => now()]);

            DB::commit(); // commit transaction before notifications

            $totalBatchesUsed = array_sum(array_map(function($allocation) {
                return count($allocation['batches']);
            }, $stockAllocations));

            Log::info("✅ MedicationRequest#{$request->id} successfully fulfilled using FIFO. Items: " . count($stockAllocations) . ", Batches used: {$totalBatchesUsed}");

            // ✅ Step 4: Send notifications (outside transaction)
            $this->notifyPatient($request);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("❌ Error processing MedicationRequest#{$request->id} FIFO fulfillment: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            // Update request status to rejected (failed fulfillment)
            try {
                $request->update([
                    'status' => 'rejected',
                    'rejection_reason' => 'System error during FIFO fulfillment: ' . $e->getMessage()
                ]);
                Log::info("📝 MedicationRequest#{$request->id} status updated to rejected due to fulfillment error");
            } catch (\Exception $updateError) {
                Log::error("❌ Failed to update request status after error: " . $updateError->getMessage());
            }
        }
    }

    /**
     * Allocate stock using FIFO (First In, First Out) algorithm.
     * 
     * @param string $medicationId
     * @param int $requiredQuantity
     * @return array Allocation result with batches and availability info
     */
    protected function allocateFifoStock(string $medicationId, int $requiredQuantity): array
    {
        // Get all available batches for this medication, ordered by received_date (FIFO)
        $availableBatches = FacilityMedicationInventory::where('medication_id', $medicationId)
            ->where('current_stock', '>', 0)
            ->where('stock_status', FacilityMedicationInventory::STATUS_ACTIVE)
            ->orderBy('received_date', 'asc') // FIFO: oldest first
            ->orderBy('expiration_date', 'asc') // Then by expiration (FEFO within FIFO)
            ->lockForUpdate()
            ->get();

        $totalAvailable = $availableBatches->sum('current_stock');
        $batches = [];
        $remainingQuantity = $requiredQuantity;

        foreach ($availableBatches as $batch) {
            if ($remainingQuantity <= 0) {
                break;
            }

            $availableInBatch = $batch->current_stock;
            $depletionAmount = min($remainingQuantity, $availableInBatch);

            if ($depletionAmount > 0) {
                $batches[] = [
                    'inventory' => $batch,
                    'depletion_amount' => $depletionAmount,
                    'previous_stock' => $availableInBatch,
                    'lot_number' => $batch->lot_number,
                    'expiration_date' => $batch->expiration_date,
                    'received_date' => $batch->received_date
                ];

                $remainingQuantity -= $depletionAmount;
                
                Log::info("📋 FIFO allocation: Using {$depletionAmount} from batch {$batch->inventory_id} (Lot: {$batch->lot_number}, Received: {$batch->received_date}, Exp: {$batch->expiration_date})");
            }
        }

        return [
            'sufficient' => $remainingQuantity <= 0,
            'total_available' => $totalAvailable,
            'required_quantity' => $requiredQuantity,
            'remaining_quantity' => max(0, $remainingQuantity),
            'batches' => $batches,
            'available_batches' => $availableBatches->toArray()
        ];
    }

    /**
     * Notify admins and inventory staff about insufficient stock.
     */
    protected function notifyAdminsAndStaff(array $failedItems, $request)
    {
        try {
            $recipients = User::whereIn('role', ['administrator', 'inventory-staff'])->get();

            if ($recipients->isEmpty()) {
                Log::warning("⚠️ No admin or inventory staff found to notify about stock shortage");
                return;
            }

            $itemDetails = [];
            foreach ($failedItems as $failure) {
                $itemDetails[] = "{$failure['medication_id']}: {$failure['reason']} (required: {$failure['required']}, available: {$failure['available']})";
            }

            $message = "MedicationRequest#{$request->id} rejected due to stock issues: " . implode('; ', $itemDetails);

            foreach ($recipients as $user) {
                Notification::create([
                    'user_id' => $user->id,
                    'role' => $user->role,
                    'is_global' => false,
                    'type' => 'stock_error',
                    'title' => 'Medication Request Rejected - Insufficient Stock',
                    'message' => $message,
                    'action_url' => route('inventory.index'),
                ]);
            }

            Log::info("🚨 Stock shortage notifications sent to {$recipients->count()} admin/staff accounts for Request#{$request->id}");
        } catch (\Exception $e) {
            Log::error("❌ Error notifying admins/staff about stock shortage: " . $e->getMessage());
        }
    }

    /**
     * Notify the patient their medication is ready.
     */
    protected function notifyPatient($request)
    {
        try {
            $user = User::where('patient_id', $request->patient_id)->first();

            if (!$user) {
                Log::warning("⚠️ No user found for patient ID {$request->patient_id}");
                return;
            }

            Notification::create([
                'user_id' => $user->id,
                'role' => 'patient',
                'is_global' => false,
                'type' => 'medication_fulfilled',
                'title' => 'Your Medication Request is Ready for Pickup',
                'message' => "Your prescription (Request #{$request->id}) has been fulfilled and is ready for pickup.",
                'action_url' => route('medication-requests.show', $request->id),
            ]);

            // Send fulfillment email
            if ($user->email) {
                \Mail::to($user->email)->queue(new \App\Mail\MedicationRequestFulfilledMail($request));
                Log::info("✅ Fulfillment email sent to patient (User #{$user->id}, {$user->email}) for Request #{$request->id}.");
            }

            Log::info("✅ Fulfillment notification sent to patient (User #{$user->id}) for Request #{$request->id}.");
        } catch (\Exception $e) {
            Log::error("❌ Error sending fulfillment notification/email: " . $e->getMessage());
        }
    }
}
