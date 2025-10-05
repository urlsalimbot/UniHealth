<?php

namespace App\Http\Controllers\Patients;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Models\Patients;
use Inertia\Inertia;


class PatientsIndexController extends Controller
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
}
