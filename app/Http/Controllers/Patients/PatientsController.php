<?php

namespace App\Http\Controllers\Patients;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Patient;
use Inertia\Inertia;


class PatientsController extends Controller
{
    public function index(Request $request)
    {
        $query = Patient::query();

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
        $patient = Patient::findOrFail($id);
        return Inertia::render("patients/patient-singleview", [
            'patient' => $patient,
        ]);
    }

    // Store a new patient
    public function store(Request $request)
    {
        $patient = Patient::create($request->all());
        return response()->json($patient, 201);
    }

    // Update an existing patient
    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);
        $patient->update($request->all());
        return response()->json($patient);
    }

    // Delete a patient
    public function destroy($id)
    {
        Patient::destroy($id);
        return response()->json(null, 204);
    }
}
