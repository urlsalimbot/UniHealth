<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\MedicationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MedicationRequestController extends Controller
{
    public function main()
    {
        $requests = MedicationRequest::with(['patient', 'reviewer'])
            ->latest()
            ->get();

        return Inertia::render('inventory/med-request-index', [
            'requests' => $requests
        ]);
    }

    public function create()
    {
        return Inertia::render('inventory/med-request-p');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'prescription' => 'required|file|mimes:jpeg,png,pdf|max:4096',
        ]);

        if ($request->hasFile('prescription') && $request->file('prescription')->isValid()) {
            // Store the file in the 'prescriptions' directory on the default disk (usually storage/app)
            $path = $request->file('prescription')->store('prescriptions');

            // Save the path and mime type in the database, not the raw file content
            MedicationRequest::create([
                'patient_id' => Auth::user()->patient_id,
                'prescription_file' => $path, // store file path, e.g. 'prescriptions/abc123.pdf'
                'mime_type' => $request->file('prescription')->getMimeType(),
                'status' => 'pending',
            ]);
        } else {
            return back()->withErrors(['prescription' => 'Invalid file upload']);
        }

        return redirect()->route('medication-requests.main')
            ->with('success', 'Medication request submitted successfully.');
    }

    public function show(MedicationRequest $medicationRequest)
    {
        // Get the file path from database instead of raw content
        $path = $medicationRequest->prescription_file;

        // Check if file exists
        if (!Storage::exists($path)) {
            abort(404, 'File not found.');
        }

        // Stream the file from storage with correct content type
        return Storage::download($path, basename($path), [
            'Content-Type' => $medicationRequest->mime_type,
            'Content-Disposition' => 'inline; filename="' . basename($path) . '"',
        ]);
    }

    public function updateStatus(Request $request, MedicationRequest $medicationRequest)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected,fulfilled',
        ]);

        $medicationRequest->update([
            'status' => $request->status,
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Request status updated.');
    }
}
