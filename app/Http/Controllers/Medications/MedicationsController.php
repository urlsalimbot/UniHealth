<?php

namespace App\Http\Controllers\Medications;


use App\Http\Controllers\Controller;

use App\Models\Medications;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicationsController extends Controller
{
    /**
     * Display a listing of medications.
     */
    public function index(Request $request)
    {
        $query = Medications::query();

        // Filtering
        if ($request->filled('generic_name')) {
            $query->where('generic_name', 'like', '%' . $request->generic_name . '%');
        }

        // Sorting
        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');    
        $query->orderBy($sort, $direction);

        // Paginate (server-side)
        $medications = $query->paginate($request->get('per_page', 10))
            ->appends($request->query());

        return Inertia::render('medications/inventory-index', [
            'medi' => $medications,
            'filters' => $request->only(['generic_name', 'sort', 'direction', 'per_page']),
        ]);

    }

    /**
     * Show the form for creating a new medication.
     */
    public function create()
    {
        return Inertia::render('medications/create');
    }

    /**
     * Store a newly created medication in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'generic_name' => 'required|string|max:255',
            'brand_names' => 'nullable|string|max:255',
            'strength' => 'nullable|string|max:100',
            'dosage_form' => 'nullable|string|max:100',
            'drug_class' => 'nullable|string|max:100',
            'controlled_substance' => 'nullable|boolean',
            'fda_registration' => 'nullable|string|max:100',
        ]);

        Medications::create($validated);

        return redirect()->route('medications.index')
            ->with('success', 'Medication added successfully.');
    }

    /**
     * Show the form for editing the specified medication.
     */
    public function edit(string $id)    
    {
        $medication = Medications::findOrFail($id);

        return Inertia::render('medications/edit', [
            'medication' => $medication,
        ]);
    }

    /**
     * Update the specified medication in storage.
     */
    public function update(Request $request, string $id)
    {
        $medication = Medications::findOrFail($id);

        $validated = $request->validate([
            'generic_name' => 'required|string|max:255',
            'brand_names' => 'nullable|string|max:255',
            'strength' => 'nullable|string|max:100',
            'dosage_form' => 'nullable|string|max:100',
            'drug_class' => 'nullable|string|max:100',
            'controlled_substance' => 'nullable|boolean',
            'fda_registration' => 'nullable|string|max:100',
        ]);

        $medication->update($validated);

        return redirect()->route('medications.index')
            ->with('success', 'Medication updated successfully.');
    }

    /**
     * Remove the specified medication from storage.
     */
    public function destroy(string $id)
    {
        $medication = Medications::findOrFail($id);
        $medication->delete();

        return redirect()->route('medications.index')
            ->with('success', 'Medication deleted successfully.');
    }
}