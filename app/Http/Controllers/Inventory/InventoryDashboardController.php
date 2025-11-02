<?php

namespace App\Http\Controllers\Inventory;


use App\Http\Controllers\Controller;
use App\Models\MedicationRequest;
use App\Models\Medications;
use App\Models\FacilityMedicationInventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryDashboardController extends Controller
{
    /**
     * Display a listing of medications and stocks.
     */
    public function index(Request $request)
    {
        // 📦 Inventory pagination
        $inventoryPerPage = $request->get('per_page', 10);
        $inventoryPage = $request->get('page', 1);

        /**
         * 💊 LOAD ALL MEDICATIONS (no pagination)
         */
        $medications = Medications::select([
            'medication_id',
            'generic_name',
            'brand_names',
            'strength',
            'dosage_form',
            'drug_class',
            'created_at',
        ])
            ->orderBy('created_at', 'desc')
            ->get(); // ✅ no pagination here


        /**
         * 🧾 INVENTORY QUERY — merged by medication_id
         */
        $inventorySort = $request->get('sort', 'created_at');
        $inventoryDirection = $request->get('direction', 'desc');

        $inventory = FacilityMedicationInventory::with('medication')
            ->selectRaw('
                medication_id,
                SUM(current_stock) as total_stock,
                SUM(reorder_point) as total_reorder_point,
                SUM(minimum_stock_level) as total_minimum_stock_level,
                MAX(created_at) as latest_update
            ')
            ->groupBy('medication_id')
            ->orderBy($inventorySort, $inventoryDirection)
            ->paginate($inventoryPerPage, ['*'], 'page', $inventoryPage);

        /**
         * 🚨 LOW STOCK ITEMS (merged as well)
         */
        $low_stock_items = FacilityMedicationInventory::with('medication')
            ->selectRaw('
                medication_id,
                SUM(current_stock) as total_stock,
                SUM(reorder_point) as total_reorder_point,
                SUM(minimum_stock_level) as total_minimum_stock_level
            ')
            ->groupBy('medication_id')
            ->havingRaw('SUM(current_stock) < SUM(reorder_point)')
            ->get();

        $medrequests = MedicationRequest::with(['patient', 'reviewer'])
            ->latest()
            ->get();



        return Inertia::render('inventory/inventory-index', [
            'requests' => $medrequests,
            'medications' => $medications, // ✅ all meds (no pagination)
            'curr_inventory' => $inventory, // ✅ paginated, merged by medication_id
            'low_stock_items' => $low_stock_items,
            'filters' => $request->only(['curr_stock', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function patientIndex()
    {
        /**
         * 💊 LOAD ALL MEDICATIONS (no pagination)
         */
        $medications = Medications::select([
            'medication_id',
            'generic_name',
            'brand_names',
            'strength',
            'dosage_form',
            'drug_class',
            'created_at',
        ])
            ->orderBy('created_at', 'desc')
            ->get(); // ✅ no pagination here



        return Inertia::render('inventory/indexp', [
            'medications' => $medications, // ✅ all meds (no pagination)
        ]);
    }

}