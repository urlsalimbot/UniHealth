<?php

namespace App\Http\Controllers\Patients;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Models\Patients;
use Illuminate\Validation\ValidationException;
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

        try {
            $validated = $request->validate([
                'last_name' => 'required|string|max:255',
                'first_name' => 'required|string|max:255',
                'middle_name' => 'nullable|string|max:255',
                'suffix' => 'nullable|string|max:50',
                'maiden_name' => 'nullable|string|max:255',
                'nickname' => 'nullable|string|max:100',

                'date_of_birth' => 'required|date',
                'place_of_birth' => 'required|string|max:255',
                'gender' => 'required|in:Male,Female,other',
                'civil_status' => 'required|string|max:50',
                'nationality' => 'required|string|max:100',
                'religion' => 'nullable|string|max:100',

                'mobile_number' => 'required|string|max:20',
                'landline_number' => 'required|string|max:20',
                'email' => 'required|email|max:255',

                'house_number' => 'nullable|string|max:50',
                'street' => 'required|string|max:255',
                'barangay' => 'required|string|max:255',
                'municipality_city' => 'required|string|max:255',
                'province' => 'required|string|max:255',
                'region' => 'required|string|max:255',
                'postal_code' => 'required|string|max:20',

                'emergency_contact_name' => 'required|string|max:255',
                'emergency_contact_relationship' => 'required|string|max:100',
                'emergency_contact_number' => 'required|string|max:20',
                'emergency_contact_address' => 'required|string|max:255',

                'data_privacy_consent' => ['accepted'],
            ]);
        } catch (ValidationException $e) {
            dd($e->errors());
        }

        // ✅ Validate input
        $validated = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'suffix' => 'nullable|string|max:50',
            'maiden_name' => 'nullable|string|max:255',
            'nickname' => 'nullable|string|max:100',

            'date_of_birth' => 'required|date',
            'place_of_birth' => 'required|string|max:255',
            'gender' => 'required|in:Male,Female,other',
            'civil_status' => 'required|string|max:50',
            'nationality' => 'required|string|max:100',
            'religion' => 'nullable|string|max:100',

            'mobile_number' => 'required|string|max:20',
            'landline_number' => 'required|string|max:20',
            'email' => 'required|email|max:255',

            'house_number' => 'nullable|string|max:50',
            'street' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'municipality_city' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'region' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',

            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_relationship' => 'required|string|max:100',
            'emergency_contact_number' => 'required|string|max:20',
            'emergency_contact_address' => 'required|string|max:255',

            'data_privacy_consent' => ['accepted'],
        ]);

        // ✅ Update and trigger auditing
        $patient->update($validated);

        // ✅ Redirect (not render)
        return redirect()
            ->route('patients.show', $patient->patient_id)
            ->with('success', 'Patient record updated successfully!');
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
