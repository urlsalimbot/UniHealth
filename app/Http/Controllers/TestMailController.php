<?php

namespace App\Http\Controllers;

use App\Mail\PatientValidationMail;
use App\Mail\PatientCreatedMail;
use App\Models\Patients;
use App\Services\EmailLoggerService;
use App\Services\QrCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class TestMailController extends Controller
{
    public function testBasicMail()
    {
        // Create a test patient instance
        $testPatient = new Patients([
            'patient_id' => 'test-' . time() . '-' . rand(1000, 9999),
            'first_name' => 'John',
            'last_name' => 'Doe',
            'middle_name' => 'Test',
            'email' => 'test@example.com',
            'mobile_number' => '09123456789',
            'date_of_birth' => '1990-01-01',
            'gender' => 'Male',
            'street' => 'Test Street',
            'barangay' => 'Test Barangay',
            'municipality_city' => 'Test City',
            'province' => 'Test Province',
            'region' => 'Test Region',
            'postal_code' => '1234',
            'created_at' => now(),
        ]);

        $results = [];

        try {
            // Test validation email
            $validationMail = new PatientValidationMail($testPatient);
            EmailLoggerService::logEmailContent($validationMail, 'test@example.com');
            EmailLoggerService::logToFile($validationMail, 'test@example.com', 'test_validation');
            Mail::to('test@example.com')->send($validationMail);
            $results['validation'] = '✅ PatientValidationMail sent successfully!';
        } catch (\Exception $e) {
            $results['validation'] = '❌ PatientValidationMail failed: ' . $e->getMessage();
        }

        try {
            // Test creation email
            $creationMail = new PatientCreatedMail($testPatient);
            EmailLoggerService::logEmailContent($creationMail, 'test@example.com');
            EmailLoggerService::logToFile($creationMail, 'test@example.com', 'test_creation');
            Mail::to('test@example.com')->send($creationMail);
            $results['creation'] = '✅ PatientCreatedMail sent successfully!';
        } catch (\Exception $e) {
            $results['creation'] = '❌ PatientCreatedMail failed: ' . $e->getMessage();
        }

        return view('test-mail-results', compact('results'));
    }

    public function testWithRealPatient($patientId)
    {
        $patient = Patients::find($patientId);
        
        if (!$patient) {
            return back()->with('error', "Patient not found with ID: $patientId");
        }

        $results = [];

        try {
            // Test validation email
            Mail::to($patient->email)->send(new PatientValidationMail($patient));
            $results['validation'] = "✅ PatientValidationMail sent to {$patient->email}!";
        } catch (\Exception $e) {
            $results['validation'] = '❌ PatientValidationMail failed: ' . $e->getMessage();
        }

        try {
            // Test creation email
            Mail::to($patient->email)->send(new PatientCreatedMail($patient));
            $results['creation'] = "✅ PatientCreatedMail sent to {$patient->email}!";
        } catch (\Exception $e) {
            $results['creation'] = '❌ PatientCreatedMail failed: ' . $e->getMessage();
        }

        return view('test-mail-results', compact('results', 'patient'));
    }

    public function showTestForm()
    {
        $patients = Patients::latest()->take(10)->get();
        return view('test-mail-form', compact('patients'));
    }
}
