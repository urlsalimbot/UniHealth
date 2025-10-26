<?php

namespace App\Http\Controllers\Patients\Encounters;

use App\Http\Controllers\Controller;
use App\Models\VitalSigns;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class VitalSignStoreController extends Controller
{
    /**
     * Store a newly created vital sign record.
     */
    public function store(Request $request, string $patientId, string $encounterId): JsonResponse
    {
        // Log::debug('Vital sign store request', [
        //     'patient_id' => $patientId,
        //     'encounter_id' => $encounterId,
        //     'request_all' => $request->all(),
        // ]);

        $validated = $request->validate([
            'recorded_by'        => 'nullable|string|max:255',
            'measurement_date'   => 'required|date',
            'measurement_time'   => 'nullable|string|max:10',
            'systolic_bp'        => 'nullable|numeric',
            'diastolic_bp'       => 'nullable|numeric',
            'heart_rate'         => 'nullable|numeric',
            'respiratory_rate'   => 'nullable|numeric',
            'temperature'        => 'nullable|numeric',
            'oxygen_saturation'  => 'nullable|numeric',
            'weight'             => 'nullable|numeric',
            'height'             => 'nullable|numeric',
            'bmi'                => 'nullable|numeric',
            'pain_score'         => 'nullable|numeric|min:0|max:10',
            'pain_location'      => 'nullable|string|max:255',
            'general_appearance' => 'nullable|string|max:255',
            'mental_status'      => 'nullable|string|max:255',
            'bp_cuff_size'       => 'nullable|string|max:255',
            'thermometer_type'   => 'nullable|string|max:255',
        ]);

        $vital = VitalSigns::create(array_merge($validated, [
            'patient_id'  => $patientId,
            'encounter_id'=> $encounterId,
            'created_at'  => now(),
        ]));

        // Log::info('Vital sign created successfully', [
        //     'vital_sign_id' => $vital->vital_sign_id,
        // ]);

        return response()->json([
            'message' => 'Vital sign record created successfully!',
            'vital_sign' => $vital,
        ]);
    }
}
