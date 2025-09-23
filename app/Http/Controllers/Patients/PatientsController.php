<?php

namespace App\Http\Controllers\Patients;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Models\Patients;
use Inertia\Inertia;


class PatientsController extends Controller
{
    public function index(Request $request)
    {
        $query = Patients::query();

        // Filtering
        if ($request->filled('last_name')) {
            $query->where('last_name', 'like', '%' . $request->last_name . '%');
        }

        // Sorting
        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');
        $query->orderBy($sort, $direction);

        // Paginate (server-side)
        $patients = $query->paginate($request->get('per_page', 10))
            ->appends($request->query());

        return Inertia::render('patients/patients-view', [
            'patient' => $patients,
            'filters' => $request->only(['last_name', 'sort', 'direction', 'per_page']),
        ]);
    }


    public function create()
    {
        return Inertia::render('patients/patient-create');
    }

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

        return to_route('patient.view');
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
