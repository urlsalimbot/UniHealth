<?php

namespace App\Http\Controllers\Inventory;


use App\Http\Controllers\Controller;
use App\Models\Medications;
use App\Models\FacilityMedicationInventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryDashboardController extends Controller
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
            'medication',
        ])->select();

        if ($request->filled('medication_id')) {
            $inventoryQuery->where('medication_id', 'like', '%' . $request->medication_id . '%');
        }

        $low_stock_items = FacilityMedicationInventory::with('medication')
            ->whereColumn('current_stock', '<', 'reorder_point')
            ->get();


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
            'low_stock_items' => $low_stock_items,
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


}