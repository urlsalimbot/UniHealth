<?php

namespace App\Http\Controllers\Inventory;


use App\Http\Controllers\Controller;
use App\Models\Medications;
use App\Models\FacilityMedicationInventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExistingMedicationController extends Controller
{

    /**
     * Show the form for editing the specified medication.
     */
    public function show(string $id)
    {
        $medication = Medications::with(['facility_medication_inventory'])->findOrFail($id);

        return Inertia::render('inventory/inventory-single', [
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

        return redirect()->route('inventory.index')
            ->with('success', 'Medication updated successfully.');
    }

    /**
     * Remove the specified medication from storage.
     */
    public function destroy(string $id)
    {
        $medication = Medications::findOrFail($id);
        $medication->delete();

        return redirect()->route('inventory.index')
            ->with('success', 'Medication deleted successfully.');
    }

}