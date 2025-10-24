<?php

namespace App\Http\Controllers\Patients;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Models\Patients;
use Inertia\Inertia;


class ExistingPatientController extends Controller
{

    // Show a single patient
    public function show($id)
    {
        $patient = Patients::with([
            'medical_encounters' => function ($q) {
                $q->orderBy('encounter_date', 'desc')
                    ->with(['vital_signs', 'patient_prescriptions'])
                    ->take(5);
            },
        ])->findOrFail($id);

        $latestEncounter = $patient->medical_encounters->first();

        // Optional: Encounter types for the select dropdown in your modal
        $encounterTypes = [
            'Consultation',
            'Follow-up',
            'Emergency',
        ];

        $vitalSigns = $patient->vital_signs()->orderBy('measurement_date', 'desc')->get();

        return Inertia::render('patients/patient-singleview', [
            'patient' => $patient,
            'medical_encounters' => $patient->medical_encounters,
            'latest_encounter' => $latestEncounter,
            'vitalsigns' => $vitalSigns,
            'encounterTypes' => $encounterTypes,
        ]);
    }




    // Update an existing patient
    public function update(Request $request, $id)
    {
        $patient = Patients::findOrFail($id);
        $patient->update($request->all());
        return Inertia::render('patient/patient-edit', [

            'patient' => $patient

        ]);
    }

    // Delete a patient
    public function destroy(string $id)
    {
        $patient = Patients::findOrFail($id);
        $patient->delete();

        return redirect()
            ->route('patients.index')
            ->with('success', 'Patient deleted successfully!');
    }
}
