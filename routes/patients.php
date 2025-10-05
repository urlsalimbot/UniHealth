<?php

use App\Http\Controllers\Patients\PatientsIndexController;
use App\Http\Controllers\Patients\PatientCreateController;
use App\Http\Controllers\Patients\ExistingPatientController;

Route::prefix('patients')->name('patients.')->group(function () {
    Route::middleware(['auth', 'role:administrator,staff'])->group(function () {

        // INDEX — List all patients
        Route::get('/', [PatientsIndexController::class, 'index'])
            ->name('index');

        // CREATE — Show patient creation form
        Route::get('/create', [PatientCreateController::class, 'create'])
            ->name('create');

        // STORE — Handle patient form submission
        Route::post('/', [PatientCreateController::class, 'store'])
            ->name('store');

        // UPDATE — Update an existing patient
        Route::put('/{id}', [ExistingPatientController::class, 'update'])
            ->name('update');

        // DELETE — Delete a patient
        Route::delete('/{id}', [ExistingPatientController::class, 'destroy'])
            ->name('destroy');
    });

    Route::middleware(['auth', 'role:administrator,staff,user'])->group(function () {
        // SHOW — Show a single patient
        Route::get('/{id}', [ExistingPatientController::class, 'show'])
            ->name('show');
    });
});
