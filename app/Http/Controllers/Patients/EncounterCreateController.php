<?php

namespace App\Http\Controllers\Encounters;

use App\Http\Controllers\Controller;
use App\Models\MedicalEncounter;
use App\Models\MedicalEncounters;
use App\Models\Patients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EncounterCreateController extends Controller
{
    public function create($patient_id)
    {
        $patient = Patients::with(['medical_encounters' => fn($q) => $q->latest()])->findOrFail($patient_id);
        $lastEncounter = $patient->medical_encounters->first();

        return Inertia::render('patients/components/CreateEncounterModal', [
            'patient' => $patient,
            'lastEncounter' => $lastEncounter,
            'encounterTypes' => [
                'Consultation',
                'Follow-up',
                'Emergency',
                'Routine Checkup',
                'Telemedicine',
                'Specialist Referral',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,patient_id',
            'encounter_type' => 'required|string|max:255',
            'chief_complaint' => 'nullable|string',
            'intervention' => 'nullable|string',
        ]);

        $encounter = MedicalEncounters::create([
            ...$validated,
            'encounter_date' => now(),
            'created_by' => Auth::id(),
        ]);

        // Redirect to vitals capture if requested
        if ($request->boolean('redirect_to_vitals')) {
            return redirect()->route('vitals.create', ['encounter_id' => $encounter->encounter_id]);
        }

        return redirect()
            ->route('patients.show', $validated['patient_id'])
            ->with('success', 'New medical encounter created successfully.');
    }
}
