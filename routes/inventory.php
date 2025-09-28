<?php

use App\Http\Controllers\Inventory\InventoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:administrator,staff'])->group(function () {

    Route::resource('inventory', InventoryController::class);
});
