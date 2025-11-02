<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class QrCodeService
{
    /**
     * Generate QR code for patient ID
     */
    public static function generatePatientQrCode(string $patientId): string
    {
        // For now, we'll use a simple data URL approach
        // Later you can replace this with a proper QR code library
        
        $qrData = [
            'type' => 'patient',
            'id' => $patientId,
            'url' => route('patients.show', $patientId),
            'generated' => now()->toISOString()
        ];
        
        // Generate a simple placeholder QR code using Google Charts API
        $qrText = json_encode($qrData);
        $qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" . urlencode($qrText);
        
        return $qrUrl;
    }
    
    /**
     * Generate QR code as base64 image
     */
    public static function generatePatientQrCodeBase64(string $patientId): string
    {
        $qrData = [
            'type' => 'patient',
            'id' => $patientId,
            'url' => route('patients.show', $patientId),
            'generated' => now()->toISOString()
        ];
        
        $qrText = json_encode($qrData);
        
        // Using Google Charts API for QR code generation
        $qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" . urlencode($qrText) . "&format=png";
        
        // For a more robust solution, you'd want to download and cache this
        return $qrUrl;
    }
    
    /**
     * Get patient data for QR code
     */
    public static function getPatientQrData(string $patientId): array
    {
        return [
            'type' => 'patient',
            'id' => $patientId,
            'url' => route('patients.show', $patientId),
            'generated' => now()->toISOString(),
            'system' => 'UniHealth'
        ];
    }
}
