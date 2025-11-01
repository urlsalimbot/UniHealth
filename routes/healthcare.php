<?php

use App\Http\Controllers\Inventory\MedicationRequestController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('/medication-requests', [MedicationRequestController::class, 'main'])
        ->name('medication-requests.main');
    Route::get('/medication-requests/create', [
        MedicationRequestController::class,
        'create'
    ])->name('medication-requests.create');


    Route::post('/medication-requests', [MedicationRequestController::class, 'store'])
        ->name('medication-requests.store');

    Route::get('/medication-requests/{medicationRequest}', [
        MedicationRequestController::class,
        'show'
    ])->name('medication-requests.show');

    Route::patch('/medication-requests/{medicationRequest}', [
        MedicationRequestController::class,
        'updateStatus'
    ])->name('medication-requests.updateStatus');
});