<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\FacilityMedicationInventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockEndOfLifeController extends Controller
{
    /**
     * Show the stock end-of-life dashboard (expired or low-stock).
     */
    public function index(Request $request)
    {
        $expired = FacilityMedicationInventory::with('medication')
            ->where('expiration_date', '<', now())
            ->where('current_stock', '>', 0)
            ->where('stock_status', '!=', FacilityMedicationInventory::STATUS_DISPOSED)
            ->get();

        $depleted = FacilityMedicationInventory::with('medication')
            ->where('current_stock', '<=', 0)
            ->where('stock_status', '!=', FacilityMedicationInventory::STATUS_EMPTY)
            ->get();

        return Inertia::render('inventory/stock/end-of-life', [
            'expired_items' => $expired,
            'depleted_items' => $depleted,
        ]);
    }

    /**
     * Dispose expired stock.
     */
    public function dispose(Request $request, string $inventoryId)
    {
        $inventory = FacilityMedicationInventory::findOrFail($inventoryId);
        $inventory->markAsDisposed($request->input('remarks'));

        return back()->with('success', 'Stock marked as disposed.');
    }

    /**
     * Mark stock as depleted / zeroed out.
     */
    public function zeroOut(Request $request, string $inventoryId)
    {
        $inventory = FacilityMedicationInventory::findOrFail($inventoryId);
        $inventory->markAsDepleted($request->input('remarks'));

        return back()->with('success', 'Stock marked as depleted.');
    }
}
