<?php

use App\Http\Controllers\Patients\PatientsIndexController;
use App\Http\Controllers\Patients\PatientCreateController;
use App\Http\Controllers\Patients\PatientInvitationController;
use App\Http\Controllers\Patients\PatientRegistrationController;
use App\Http\Controllers\Patients\ExistingPatientController;
use App\Http\Controllers\Patients\Encounters\AttachmentUploadController;
use App\Http\Controllers\Patients\Encounters\PrescriptionStoreController;
use App\Http\Controllers\Patients\Encounters\VitalSignStoreController;
use App\Http\Controllers\Patients\Encounters\ExistingEncounterController;
use App\Http\Controllers\Patients\Encounters\EncounterCreateController;

Route::prefix('patients')->name('patients.')->group(function () {
    Route::middleware(['auth', 'role:administrator,intake-staff,doctor'])->group(function () {

        // INDEX — List all patients
        Route::get('/', [PatientsIndexController::class, 'index'])
            ->name('index');

        // UPDATE — Update an existing patient
        Route::put('/{id}', [ExistingPatientController::class, 'update'])
            ->name('update');

        // CREATE — Show patient creation form
        Route::get('/create', [PatientCreateController::class, 'create'])
            ->name('create');

        // STORE — Handle patient form submission
        Route::post('/', [PatientCreateController::class, 'store'])
            ->name('store');

        // INVITE — Generate invite token for patient registration
        Route::post('/invite', [PatientInvitationController::class, 'store'])
            ->name('invite');

        // DELETE — Delete a patient
        Route::delete('/{id}', [ExistingPatientController::class, 'destroy'])
            ->name('destroy');

        Route::prefix('{id}/encounters')->name('encounters.')->group(function () {

            Route::post('/create', [EncounterCreateController::class, 'store'])->name('store');

            Route::post('/{encounter}/attachments', [AttachmentUploadController::class, 'store'])->name('attachments.upload');

            Route::post('/{encounter}/vitals', [VitalSignStoreController::class, 'store'])->name('vitals.store');

            Route::post('/{encounter}/prescriptions', [PrescriptionStoreController::class, 'store'])->name('prescriptions.store');

        });

    });

    Route::middleware(['auth', 'role:administrator,intake-staff,patient,doctor'])->group(function () {
        // SHOW — Show a single patient
        Route::get('/{id}', [ExistingPatientController::class, 'show'])
            ->name('show');

        // SHOW — Show patient encounters
        Route::get('/{id}/encounters', [ExistingEncounterController::class, 'index'])
            ->name('encounters.index');

    });

    Route::get('/register/{token}', [PatientRegistrationController::class, 'showForm'])
        ->name('register.show');

    Route::post('/register/{token}', [PatientRegistrationController::class, 'submit'])
        ->name('register.submit');
});
