<?php

namespace App\Http\Controllers\Patients;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Models\Patients;
use Inertia\Inertia;


class PatientCreateController extends Controller
{
    public function create()
    {
        return Inertia::render('patients/patient-create');
    }

    // Store a new patient
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'philhealth_id' => 'nullable|string|max:50|unique:patients,philhealth_id',
            'pwd_id' => 'nullable|string|max:50|unique:patients,pwd_id',
            'senior_citizen_id' => 'nullable|string|max:50|unique:patients,senior_citizen_id',

            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'suffix' => 'nullable|string|max:50',
            'maiden_name' => 'nullable|string|max:255',
            'nickname' => 'nullable|string|max:100',

            'date_of_birth' => 'nullable|date',
            'place_of_birth' => 'nullable|string|max:255',
            'gender' => 'nullable|in:Male,Female,other',
            'civil_status' => 'nullable|string|max:50',
            'nationality' => 'nullable|string|max:100',
            'religion' => 'nullable|string|max:100',

            'mobile_number' => 'nullable|string|max:20',
            'landline_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',

            'house_number' => 'nullable|string|max:50',
            'street' => 'nullable|string|max:255',
            'barangay' => 'required|string|max:255',
            'municipality_city' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'region' => 'required|string|max:255',
            'postal_code' => 'nullable|string|max:20',

            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_relationship' => 'nullable|string|max:100',
            'emergency_contact_number' => 'nullable|string|max:20',
            'emergency_contact_address' => 'nullable|string|max:255',

            'is_active' => 'boolean',
            'data_privacy_consent' => 'boolean',
            'data_privacy_consent_date' => 'nullable|date',
        ]);

        // Ensure boolean defaults (since unchecked checkboxes may be missing in request)
        $validated['is_active'] = $request->boolean('is_active');
        $validated['data_privacy_consent'] = $request->boolean('data_privacy_consent');

        $patient = Patients::create($validated);

        return to_route('patient.show', ['id' => $patient->id]);
    }
}
