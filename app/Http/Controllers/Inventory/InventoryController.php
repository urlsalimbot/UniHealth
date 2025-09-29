<?php

namespace App\Http\Controllers\Inventory;


use App\Http\Controllers\Controller;

use App\Models\Medications;
use App\Models\FacilityMedicationInventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    /**
     * Display a listing of medications.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);

        // -------------------------
        // Medications Query
        // -------------------------
        $medicationsQuery = Medications::select([
                'medication_id',
                'generic_name',
                'brand_names',
                'strength',
                'dosage_form',
                'drug_class',
                'created_at',
            ]);

        if ($request->filled('generic_name')) {
            $medicationsQuery->where('generic_name', 'like', '%' . $request->generic_name . '%');
        }

        $medicationsSort = $request->get('medications_sort', 'created_at');
        $medicationsDirection = $request->get('medications_direction', 'desc');

        $medications = $medicationsQuery
            ->orderBy($medicationsSort, $medicationsDirection)
            ->paginate($perPage)
            ->appends($request->query());

        // -------------------------
        // Inventory Query
        // -------------------------
        $inventoryQuery = FacilityMedicationInventory::with([
            'medication:medication_id'
        ])->select([
                'inventory_id',
                'facility_id',
                'medication_id',
                'current_stock',
                'minimum_stock_level',
                'maximum_stock_level',
                'reorder_point',
                'expiration_date',
                'unit_cost',
                'total_value',
                'stock_status',
                'created_at',
            ]);

        if ($request->filled('medication_id')) {
            $inventoryQuery->where('medication_id', 'like', '%' . $request->medication_id . '%');
        }

        $inventorySort = $request->get('inventory_sort', 'created_at');
        $inventoryDirection = $request->get('inventory_direction', 'desc');

        $inventory = $inventoryQuery
            ->orderBy($inventorySort, $inventoryDirection)
            ->paginate($perPage)
            ->appends($request->query());

        // -------------------------
        // Return to Inertia
        // -------------------------
        return Inertia::render('inventory/inventory-index', [
            'medi' => $medications,
            'curr_inventory' => $inventory,
            'filters' => $request->only([
                'generic_name',
                'medication_id',
                'medications_sort',
                'medications_direction',
                'inventory_sort',
                'inventory_direction',
                'per_page',
            ]),
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