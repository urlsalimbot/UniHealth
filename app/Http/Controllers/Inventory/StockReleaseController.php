<?php

namespace App\Http\Controllers\Inventory;


use App\Http\Controllers\Controller;
use App\Models\HealthcareFacilities;
use App\Models\Medications;
use App\Models\FacilityMedicationInventory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockReleaseController extends Controller
{
    /**
     * Show the form for creating a new stock.
     */
    public function create()
    {
        $medications = Medications::select('medication_id', 'generic_name', 'brand_names', 'strength', 'dosage_form')
            ->orderBy('generic_name')
            ->get();

        $facilities = HealthcareFacilities::select('facility_id', 'facility_name')->orderBy('facility_name')->get();

        return Inertia::render('inventory/stock/intake', [
            'medications' => $medications,
            'facilities' => $facilities,
        ]);
    }

    /**
     * Store a newly created medication in stock.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'facility_id' => 'required|string',
            'medication_id' => 'required|string|exists:medications,medication_id',
            'current_stock' => 'required|numeric|min:0',
            'minimum_stock_level' => 'required|numeric|min:0',
            'maximum_stock_level' => 'nullable|numeric|min:0',
            'reorder_point' => 'nullable|numeric|min:0',
            'lot_number' => 'nullable|string|max:255',
            'expiration_date' => 'nullable|date',
            'manufacturer_batch' => 'nullable|string|max:255',
            'unit_cost' => 'nullable|numeric|min:0',
            'total_value' => 'nullable|numeric|min:0',
            'storage_location' => 'nullable|string|max:255',
            'storage_conditions' => 'nullable|string|max:255',
            'storage_temperature_min' => 'nullable|numeric',
            'storage_temperature_max' => 'nullable|numeric',
            'supplier' => 'nullable|string|max:255',
            'purchase_order_number' => 'nullable|string|max:255',
            'received_date' => 'nullable|date',
        ]);

        // Automatically attach authenticated user's name
        $validated['received_by'] = Auth::user()->name ?? 'System';
        $validated['stock_status'] = 'Received';

        FacilityMedicationInventory::create($validated);

        return redirect()->route('inventory.index')->with('success', 'Inventory successfully added.');
    }
}