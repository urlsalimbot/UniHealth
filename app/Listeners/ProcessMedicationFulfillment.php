<?php

namespace App\Listeners;

use App\Events\LowStockDetected;
use App\Events\MedicationFulfilled;
use App\Models\FacilityMedicationInventory;
use App\Models\InventoryTransaction;
use App\Models\Notification;
use App\Models\Patients;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;


class ProcessMedicationFulfillment implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(MedicationFulfilled $event)
    {
        $request = $event->request;

        foreach ($request->items as $item) {
            $inventory = FacilityMedicationInventory::where('medication_id', $item->medication_id)->first();

            if (!$inventory || $inventory->stock < $item->quantity) {
                Log::warning("Insufficient stock for medication ID: {$item->medication_id}");
                continue;
            }

            $previous = $inventory->stock;
            $inventory->decrement('stock', $item->quantity);

            InventoryTransaction::create([
                'facility_medication_inventory_id' => $inventory->id,
                'transaction_type' => 'release',
                'quantity' => $item->quantity,
                'previous_stock' => $previous,
                'new_stock' => $inventory->stock,
                'reference' => 'MedicationRequest#' . $request->id,
                'remarks' => "Fulfilled prescription for patient {$request->patient_id}",
                'performed_by' => auth()->id(),
            ]);

            // Trigger your existing low stock alert
            if ($inventory->stock < $inventory->reorder_threshold) {
                event(new LowStockDetected($inventory));
            }
        }

        $request->update(['status' => 'fulfilled']);

        // ✅ Notify the patient (user)
        $this->notifyPatient($request);
    }

    protected function notifyPatient($request)
    {
        try {
            // Load the patient's user
            $patient = Patients::with('user')->where('patient_id', $request->patient_id)->first();

            if (!$patient || !$patient->user) {
                Log::warning("No user found for patient ID {$request->patient_id}");
                return;
            }

            // Create the notification record
            $notification = Notification::create([
                'user_id' => $patient->user->id,
                'role' => 'patient',
                'is_global' => false,
                'type' => 'medication_fulfilled',
                'title' => 'Your Medication Request is Ready for Pickup',
                'message' => "Your prescription (Request #{$request->id}) has been fulfilled and is ready for pickup.",
                'action_url' => route('medication-requests.show', $request->id),
            ]);

            Log::info("Notification created for patient ID {$request->patient_id} (Request #{$request->id}).");

        } catch (\Exception $e) {
            Log::error("Error sending fulfillment notification: " . $e->getMessage());
        }
    }
}
