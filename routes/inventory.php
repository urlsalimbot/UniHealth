<?php

use App\Http\Controllers\Inventory\ExistingMedicationController;
use App\Http\Controllers\Inventory\ExistingStockController;
use App\Http\Controllers\Inventory\StockIntakeController;
use App\Http\Controllers\Inventory\StockReleaseController;
use App\Http\Controllers\Inventory\InventoryDashboardController;
use App\Http\Controllers\Inventory\MedicationCreateController;
use App\Http\Controllers\Inventory\StockEndOfLifeController;

use Illuminate\Support\Facades\Route;

Route::prefix('inventory')->name('inventory.')->group(function () {
    Route::middleware(['auth', 'role:administrator,pharmacist'])->group(function () {

        // CREATE — Show inventory medication creation form
        Route::get('medication/create', [MedicationCreateController::class, 'create'])
            ->name('medication.create');

        // STORE — Handle inventory medication form submission
        Route::post('medication/', [MedicationCreateController::class, 'store'])
            ->name('medication.store');


        // UPDATE — Update an existing inventory
        Route::put('medication/{id}', [ExistingMedicationController::class, 'update'])
            ->name('medication.update');

        // DELETE — Delete a inventory
        Route::delete('/{id}', [ExistingMedicationController::class, 'destroy'])
            ->name('medication.destroy');

        // CREATE — Show inventory stock creation form
        Route::get('stock/create', [StockIntakeController::class, 'create'])
            ->name('stock.create');

        // STORE — Handle inventory stock form submission
        Route::post('stock/', [StockIntakeController::class, 'store'])
            ->name('stock.store');

        // CREATE — Show inventory stock release form
        Route::get('stock/release', [StockReleaseController::class, 'show'])
            ->name('stock.release');

        // STORE — Handle inventory stock release form submission
        Route::post('stock/', [StockReleaseController::class, 'store'])
            ->name('stock.fulfill');

        Route::post('/{inventory}/dispose', [StockEndOfLifeController::class, 'dispose'])
            ->name('dispose');

        Route::post('/{inventory}/zero', [StockEndOfLifeController::class, 'zeroOut'])
            ->name('zero');
    });

    Route::middleware(['auth', 'role:administrator,intake-staff,pharm,doctor'])->group(function () {

        // INDEX — List all inventory
        Route::get('/', [InventoryDashboardController::class, 'index'])
            ->name('index');
    });

    Route::middleware(['auth', 'role:administrator,intake-staff,patient,pharm,doctor'])->group(function () {

        // SHOW — Show a single inventory
        Route::get('/{id}', [ExistingMedicationController::class, 'show'])
            ->name('item.show');

    });
});
