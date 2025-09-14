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
    public function index()
    {
        $medications = Medications::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('medications/index', [
            'medications' => $medications,
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
            'generic_name'         => 'required|string|max:255',
            'brand_names'          => 'nullable|string|max:255',
            'strength'             => 'nullable|string|max:100',
            'dosage_form'          => 'nullable|string|max:100',
            'drug_class'           => 'nullable|string|max:100',
            'controlled_substance' => 'nullable|boolean',
            'fda_registration'     => 'nullable|string|max:100',
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

        return Inertia::render('medications/esdit', [
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
            'generic_name'         => 'required|string|max:255',
            'brand_names'          => 'nullable|string|max:255',
            'strength'             => 'nullable|string|max:100',
            'dosage_form'          => 'nullable|string|max:100',
            'drug_class'           => 'nullable|string|max:100',
            'controlled_substance' => 'nullable|boolean',
            'fda_registration'     => 'nullable|string|max:100',
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