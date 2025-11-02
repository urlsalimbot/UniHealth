<?php

namespace App\Listeners;

use App\Events\LowStockDetected;
use App\Events\MedicationFulfilled;
use App\Models\FacilityMedicationInventory;
use App\Models\InventoryTransaction;
use App\Models\Notification;
use App\Models\User;
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
     * Handle the event.
     */
    public function handle(MedicationFulfilled $event)
    {
        $request = $event->request;

        // Always handle fulfillment atomically
        DB::beginTransaction();

        try {
            // ✅ Step 1: Pre-check stock
            foreach ($request->items as $item) {
                $inventory = FacilityMedicationInventory::where('medication_id', $item->medication_id)->first();
                $available = $inventory?->stock ?? 0;

                if (!$inventory || $available < $item->quantity) {
                    Log::warning("❌ Insufficient stock for {$item->medication_id}, required {$item->quantity}, available {$available}");

                    // Notify admins and inventory staff
                    $this->notifyAdminsAndStaff($item, $request);

                    // Mark the request as rejected
                    $request->update([
                        'status' => 'rejected',
                        'rejection_reason' => "Insufficient stock for {$item->medication_id}",
                    ]);

                    DB::commit(); // commit rejection
                    return;
                }
            }

            // ✅ Step 2: Deduct stock & record transactions
            foreach ($request->items as $item) {
                $inventory = FacilityMedicationInventory::where('medication_id', $item->medication_id)->first();

                $previous = $inventory->stock;
                $inventory->decrement('stock', $item->quantity);

                InventoryTransaction::create([
                    'facility_medication_inventory_id' => $inventory->inventory_id ?? $inventory->id,
                    'transaction_type' => 'release',
                    'quantity' => $item->quantity,
                    'previous_stock' => $previous,
                    'new_stock' => $inventory->stock,
                    'reference' => 'MedicationRequest#' . $request->id,
                    'remarks' => "Fulfilled prescription for patient {$request->patient_id}",
                    'performed_by' => $request->approved_by ?? auth()->id(),
                ]);

                // Low stock alert
                if ($inventory->stock < $inventory->reorder_threshold) {
                    event(new LowStockDetected($inventory));
                }
            }

            // ✅ Step 3: Mark fulfilled
            $request->update(['status' => 'fulfilled']);

            DB::commit(); // commit before notifications

            // ✅ Step 4: Notify patient (outside transaction)
            $this->notifyPatient($request);

            Log::info("✅ MedicationRequest#{$request->id} successfully fulfilled.");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("❌ Error processing fulfillment: " . $e->getMessage());
        }
    }

    /**
     * Notify admins and inventory staff about insufficient stock.
     */
    protected function notifyAdminsAndStaff($item, $request)
    {
        try {
            $recipients = User::whereIn('role', ['administrator', 'inventory-staff'])->get();

            foreach ($recipients as $user) {
                Notification::create([
                    'user_id' => $user->id, // ✅ attach to actual user
                    'role' => $user->role,
                    'is_global' => false,
                    'type' => 'stock_error',
                    'title' => 'Insufficient Stock for Medication',
                    'message' => "Request #{$request->id} rejected — insufficient stock for {$item->medication_id}.",
                    'action_url' => route('inventory.index'),
                ]);
            }

            Log::info("🚨 Stock shortage notification sent to " . $recipients->count() . " admin/staff accounts for {$item->medication_id}.");
        } catch (\Exception $e) {
            Log::error("❌ Error notifying admins/staff: " . $e->getMessage());
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

            Log::info("✅ Fulfillment notification sent to patient (User #{$user->id}) for Request #{$request->id}.");
        } catch (\Exception $e) {
            Log::error("❌ Error sending fulfillment notification: " . $e->getMessage());
        }
    }
}
