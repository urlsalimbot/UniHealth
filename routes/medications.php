<?php

use App\Http\Controllers\Medications\MedicationsController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {

    Route::resource('medications', MedicationsController::class);
});
