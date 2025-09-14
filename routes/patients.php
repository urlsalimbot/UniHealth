<?php

use App\Http\Controllers\Patients\PatientsController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {

    Route::get('/patients', [PatientsController::class, 'index'])->name('patients.index');
    Route::get('/patients/create', [PatientsController::class, 'create'])->name('patients.create');
    Route::post('/patients', [PatientsController::class, 'store'])->name('patients.store');
    Route::get('/patients/{id}', [PatientsController::class, 'show'])->name('patients.single');
    Route::put('/patients/{id}', [PatientsController::class, 'update'])->name('patients.edit');
    Route::delete('/patients/{id}', [PatientsController::class, 'destroy'])->name('patients.destroy');

});
