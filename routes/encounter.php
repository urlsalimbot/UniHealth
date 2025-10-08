<?php

use App\Http\Controllers\Encounters\EncounterCreateController;

// Grouped under auth middleware for security
Route::middleware(['auth', 'role:administrator,staff'])->group(function () {
    // Medical Encounter routes
    Route::prefix('encounters')->name('encounters.')->group(function () {


        Route::get('/create/{patient_id}', [EncounterCreateController::class, 'create'])
            ->name('create');

        Route::post('/', [EncounterCreateController::class, 'store'])
            ->name('store');
    });
});
