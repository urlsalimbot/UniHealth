<?php

namespace App\Http\Controllers\Patients\Encounters;

use App\Http\Controllers\Controller;
use App\Models\HealthcareFacilities;
use App\Models\MedicalEncounters;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Log;
use Str;

class EncounterCreateController extends Controller
{
    public function store(Request $request)
    {
        $facility = HealthcareFacilities::inRandomOrder()->first();

        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,patient_id',
            'encounter_type' => 'required|string|max:255',
            'encounter_class' => 'nullable|string|max:255',
            'chief_complaint' => 'nullable|string',
            'intervention' => 'nullable|string',
            'admission_date' => 'nullable|date',
            'discharge_date' => 'nullable|date|after_or_equal:admission_date',
            'encounter_status' => 'nullable|string|max:255',
            'redirect_to_vitals' => 'nullable|boolean',
        ]);

        $encounter = MedicalEncounters::create([
            'encounter_id' => (string) Str::uuid(),
            'patient_id' => $validated['patient_id'],
            'facility_id' => $facility->facility_id,
            'encounter_type' => $validated['encounter_type'],
            'encounter_class' => $validated['encounter_class'] ?? null,
            'chief_complaint' => $validated['chief_complaint'] ?? null,
            'intervention' => $validated['intervention'] ?? null,
            'encounter_date' => now()->toDateString(),
            'encounter_time' => now()->toTimeString(),
            'admission_date' => $validated['admission_date'] ?? null,
            'discharge_date' => $validated['discharge_date'] ?? null,
            'encounter_status' => $validated['encounter_status'] ?? 'active',
            'created_by' => Auth::id(),
        ]);

        // Optional redirect to vitals page
        if ($request->boolean('redirect_to_vitals')) {
            return redirect()
                ->route('vitals.create', ['encounter_id' => $encounter->encounter_id])
                ->with('success', 'Encounter created. Proceed to record vitals.');
        }

        return redirect()
            ->route('patients.encounters.index', $validated['patient_id'])
            ->with('success', 'New medical encounter created successfully.');
    }

}
