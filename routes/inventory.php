<?php

use App\Http\Controllers\Inventory\InventoryCreateController;
use App\Http\Controllers\Inventory\InventoryDashboardController;
use App\Http\Controllers\Inventory\ExistingInventoryController;
use App\Http\Controllers\Inventory\MedicationCreateController;
use App\Http\Controllers\Inventory\StockCreateController;
use Illuminate\Support\Facades\Route;

Route::prefix('inventory')->name('inventory.')->group(function () {
    Route::middleware(['auth', 'role:administrator,staff'])->group(function () {



        // CREATE — Show inventory medication creation form
        Route::get('medication/create', [MedicationCreateController::class, 'create'])
            ->name('medicationcreate');

        // STORE — Handle inventory medication form submission
        Route::post('medication/', [MedicationCreateController::class, 'store'])
            ->name('medicationstore');

        // CREATE — Show inventory medication creation form
        Route::get('stock/create', [StockCreateController::class, 'create'])
            ->name('stockcreate');

        // STORE — Handle inventory medication form submission
        Route::post('stock/', [StockCreateController::class, 'store'])
            ->name('stockstore');

        // UPDATE — Update an existing inventory
        Route::put('medication/{id}', [ExistingInventoryController::class, 'update'])
            ->name('update');

        // UPDATE — Update an existing inventory
        Route::put('stocks/bulkupdate', [ExistingInventoryController::class, 'bulkupdate'])
            ->name('bulkupdate');

        // DELETE — Delete a inventory
        Route::delete('/{id}', [ExistingInventoryController::class, 'destroy'])
            ->name('destroy');
    });

    Route::middleware(['auth', 'role:administrator,staff,user'])->group(function () {


        // SHOW — Show a single inventory
        Route::get('/{id}', [ExistingInventoryController::class, 'show'])
            ->name('item.show');


        // INDEX — List all inventory
        Route::get('/', [InventoryDashboardController::class, 'index'])
            ->name('index');
    });
});
