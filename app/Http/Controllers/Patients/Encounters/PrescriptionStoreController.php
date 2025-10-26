<?php

namespace App\Http\Controllers\Patients\Encounters;

use App\Http\Controllers\Controller;
use App\Models\PatientPrescriptions;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PrescriptionStoreController extends Controller
{
    /**
     * Store a newly created patient prescription record.
     */
    public function store(Request $request, string $patientId, string $encounterId): JsonResponse
    {
        // ✅ Validate input
        $validated = $request->validate([
            'medication_id' => 'required|string|exists:medications,medication_id',
            'dosage' => 'nullable|string|max:255',
            'frequency' => 'nullable|string|max:255',
            'route' => 'nullable|string|max:255',
            'duration' => 'nullable|string|max:255',
            'quantity_prescribed' => 'nullable|numeric|min:0',
            'refills_allowed' => 'nullable|integer|min:0',
            'special_instructions' => 'nullable|string|max:500',
            'indication' => 'nullable|string|max:255',
            'prescription_date' => 'nullable|date',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'prescription_status' => 'nullable|string|max:100',
        ]);

        // ✅ Create prescription record
        $prescription = PatientPrescriptions::create(array_merge($validated, [
            'patient_id' => $patientId,
            'encounter_id' => $encounterId,
            'created_at' => now(),
        ]));

        // ✅ Return JSON response (no redirect)
        return response()->json([
            'message' => 'Prescription created successfully!',
            'prescription' => $prescription,
        ]);
    }
}
