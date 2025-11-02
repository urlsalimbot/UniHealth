<?php

use App\Http\Controllers\Inventory\MedicationRequestController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:administrator,inventory-staff'])->group(function () {

    Route::get('/medication-requests/{medicationRequest}', [
        MedicationRequestController::class,
        'show'
    ])->name('medication-requests.show');

    Route::post('/medication-requests/{medicationRequest}/approve', [
        MedicationRequestController::class,
        'approve'
    ])->name('medication-requests.approve');


});
Route::middleware(['auth', 'role:administrator,inventory-staff,patient'])->group(function () {

    Route::post('/medication-requests', [MedicationRequestController::class, 'store'])
        ->name('medication-requests.store');
});