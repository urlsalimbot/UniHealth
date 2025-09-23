<?php

use App\Http\Controllers\Patients\PatientsController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {

    Route::resource('patients', PatientsController::class);

});