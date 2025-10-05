<?php

use App\Http\Controllers\Inventory\InventoryCreateController;
use App\Http\Controllers\Inventory\InventoryDashboardController;
use App\Http\Controllers\Inventory\ExistingInventoryController;
use Illuminate\Support\Facades\Route;

Route::prefix('inventory')->name('inventory.')->group(function () {
    Route::middleware(['auth', 'role:administrator,staff'])->group(function () {



        // CREATE — Show patient creation form
        Route::get('/create', [InventoryCreateController::class, 'create'])
            ->name('create');

        // STORE — Handle patient form submission
        Route::post('/', [InventoryCreateController::class, 'store'])
            ->name('store');

        // UPDATE — Update an existing patient
        Route::put('/{id}', [ExistingInventoryController::class, 'update'])
            ->name('update');

        // UPDATE — Update an existing patient
        Route::put('/bulkupdate', [ExistingInventoryController::class, 'bulkupdate'])
            ->name('bulkupdate');

        // DELETE — Delete a patient
        Route::delete('/{id}', [ExistingInventoryController::class, 'destroy'])
            ->name('destroy');
    });

    Route::middleware(['auth', 'role:administrator,staff,user'])->group(function () {
        // SHOW — Show a single inventory
        Route::get('/{id}', [ExistingInventoryController::class, 'show'])
            ->name('show');


        // INDEX — List all inventory
        Route::get('/', [InventoryDashboardController::class, 'index'])
            ->name('index');
    });
});
