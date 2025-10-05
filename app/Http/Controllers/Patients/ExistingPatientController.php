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
            'vital_signs' => fn($q) => $q->orderBy('created_at', 'desc'),
            'medical_encounters' => fn($q) => $q->orderBy('encounter_date', 'desc'),
            'medical_encounters.patient_prescriptions',
        ])->findOrFail($id);

        return Inertia::render('patients/patient-singleview', [
            'patient' => $patient,
            'vital_signs' => $patient->vital_signs,
            'medical_encounters' => $patient->medical_encounters,
            'patient_prescriptions' => $patient->medical_encounters
                ->pluck('patient_prescriptions')
                ->flatten(),
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
