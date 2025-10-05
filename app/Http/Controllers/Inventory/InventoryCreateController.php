<?php

namespace App\Http\Controllers\Inventory;


use App\Http\Controllers\Controller;
use App\Models\Medications;
use App\Models\FacilityMedicationInventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryCreateController extends Controller
{
   
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
}       