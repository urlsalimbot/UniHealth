<?php

namespace App\Http\Controllers\Inventory;

use App\Events\MedicationFulfilled;
use App\Http\Controllers\Controller;
use App\Models\MedicationRequest;
use App\Models\MedicationRequestItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MedicationRequestController extends Controller
{

    public function store(Request $request)
    {
        $data = $request->validate([
            'prescription_file' => 'required|file|mimes:pdf,jpg,png|max:4096',
        ]);

        // Store file in the 'public' disk under /prescriptions
        $path = $request->file('prescription_file')->store('prescriptions', 'public');

        // Create the medication request
        $requestRecord = MedicationRequest::create([
            'patient_id' => auth()->user()->patient_id,
            'prescription_file' => $path,
            'status' => 'pending',
        ]);

        // Create a notification for pharmacists and admins
        \App\Models\Notification::create([
            'is_global' => false,
            'type' => 'Medication Request',
            'role' => 'inventory-staff', // or 'admin', depending on how your roles are structured
            'title' => 'New Medication Request Pending Review',
            'message' => 'A new prescription has been uploaded and requires validation.',
            'action_url' => route('inventory.patient.index'),
        ]);

        // Optionally notify both admins and pharmacists:
        \App\Models\Notification::create([
            'is_global' => false,
            'type' => 'Medication Request',
            'role' => 'administrator',
            'title' => 'New Medication Request Pending Review',
            'message' => 'A new prescription has been uploaded and requires validation.',
            'action_url' => route('inventory.patient.index'),
        ]);

        // Redirect properly with success flash
        return back()
            ->with('success', 'Prescription uploaded successfully. A pharmacist will review your request shortly.');
    }


    public function show(MedicationRequest $medicationRequest)
    {
        // File path stored in 'public' disk (e.g., storage/app/public/prescriptions/xxx.pdf)
        $path = $medicationRequest->prescription_file;

        // Ensure the file exists on the correct disk
        if (!Storage::disk('public')->exists($path)) {
            abort(404, 'Prescription file not found.');
        }

        // Derive MIME type dynamically instead of storing it
        $mimeType = Storage::disk('public')->mimeType($path) ?? 'application/octet-stream';
        $filename = basename($path);

        // Stream file to browser for inline viewing
        return Storage::disk('public')->response($path, $filename, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
        ]);
    }

    public function approve(Request $request, $id)
    {
        $validated = request()->validate([
            'items' => 'required|array',
            'items.*.medication_id' => 'required|exists:medications,medication_id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $medicationRequest = MedicationRequest::findOrFail($id);

        // Store the approved items
        foreach ($validated['items'] as $item) {
            MedicationRequestItem::create([
                'medication_request_id' => $medicationRequest->id,
                'medication_id' => $item['medication_id'],
                'quantity' => $item['quantity'],
            ]);
        }

        // Mark request as fulfilled
        $medicationRequest->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        event(new MedicationFulfilled($medicationRequest));

        return back()->with('success', 'Request approved successfully');
    }

}
