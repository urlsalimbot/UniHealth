<?php

use App\Http\Controllers\Patients\PatientsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:administrator,staff'])->group(function () {

    Route::resource('patients', PatientsController::class);

});