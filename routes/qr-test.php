<?php

use Illuminate\Support\Facades\Route;
use App\Services\QrCodeService;

Route::get('/test-qr-code/{patientId}', function ($patientId) {
    $qrUrl = QrCodeService::generatePatientQrCode($patientId);
    $qrData = QrCodeService::getPatientQrData($patientId);
    
    return response()->json([
        'patient_id' => $patientId,
        'qr_url' => $qrUrl,
        'qr_data' => $qrData
    ]);
});

Route::get('/show-qr-code/{patientId}', function ($patientId) {
    $qrUrl = QrCodeService::generatePatientQrCode($patientId);
    $qrData = QrCodeService::getPatientQrData($patientId);
    
    return view('qr-test', [
        'qrUrl' => $qrUrl,
        'qrData' => $qrData,
        'patientId' => $patientId
    ]);
});
