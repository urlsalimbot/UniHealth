<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestMailController;

// Test mail routes
Route::get('/test-mail', [TestMailController::class, 'testBasicMail']);
Route::get('/test-mail-form', [TestMailController::class, 'showTestForm'])->name('test.mail.form');
Route::get('/test-mail-patient/{patientId}', [TestMailController::class, 'testWithRealPatient'])->name('test.mail.patient');
