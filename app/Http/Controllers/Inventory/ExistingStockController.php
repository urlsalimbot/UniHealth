<?php

namespace App\Http\Controllers\Inventory;


use App\Http\Controllers\Controller;
use App\Models\Medications;
use App\Models\FacilityMedicationInventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExistingStockController extends Controller
{

    public function bulkupdate(Request $request)
    {
        $changes = $request->input('changes', []);

        foreach ($changes as $id => $fields) {
            $inventory = FacilityMedicationInventory::find($id);
            if ($inventory) {
                $inventory->fill($fields);
                $inventory->save(); // 🔥 triggers "updated" event → audit logged        }
            }
        }
        return redirect()->route('inventory.index')
            ->with('success', 'Inventory updated successfully!');
    }

}