<?php

namespace App\Http\Controllers\Patients;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Models\Patients;
use Inertia\Inertia;
use App\Mail\PatientValidationMail;
use App\Mail\PatientCreatedMail;
use Illuminate\Support\Facades\Mail;
use App\Services\EmailLoggerService;


class PatientCreateController extends Controller
{
    public function create()
    {
        return Inertia::render('patients/patient-create');
    }

    // Store a new patient
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'philhealth_id' => 'nullable|string|max:50|unique:patients,philhealth_id',
            'pwd_id' => 'nullable|string|max:50|unique:patients,pwd_id',
            'senior_citizen_id' => 'nullable|string|max:50|unique:patients,senior_citizen_id',

            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'suffix' => 'nullable|string|max:50',
            'maiden_name' => 'nullable|string|max:255',
            'nickname' => 'nullable|string|max:100',

            'date_of_birth' => 'required|date',
            'place_of_birth' => 'required|string|max:255',
            'gender' => 'required|in:Male,Female,Other',
            'civil_status' => 'required|string|max:50',
            'nationality' => 'required|string|max:100',
            'religion' => 'nullable|string|max:100',

            'mobile_number' => 'required|string|max:20',
            'landline_number' => 'required|string|max:20',
            'email' => 'required|email|max:255',

            'house_number' => 'nullable|string|max:50',
            'street' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'municipality_city' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'region' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',

            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_relationship' => 'required|string|max:100',
            'emergency_contact_number' => 'required|string|max:20',
            'emergency_contact_address' => 'required|string|max:255',

            'data_privacy_consent' => ['accepted'],
        ]);

        // Ensure boolean defaults (since unchecked checkboxes may be missing in request)
        if ($request->boolean('data_privacy_consent')) {
            $validated['data_privacy_consent_date'] = now();
        }

        $patient = Patients::create($validated);

        // Ensure patient was created successfully and has an ID
        if (!$patient || !$patient->patient_id) {
            \Log::error('Failed to create patient or missing patient_id', [
                'validated_data' => $validated
            ]);
            return back()->with('error', 'Failed to create patient record. Please try again.');
        }

        // Log patient creation
        \Log::info('Patient created successfully', [
            'patient_id' => $patient->patient_id,
            'email' => $patient->email,
            'name' => $patient->first_name . ' ' . $patient->last_name
        ]);

        // Send validation email to patient
        try {
            $validationMail = new PatientValidationMail($patient);
            
            // Log full email content
            EmailLoggerService::logEmailContent($validationMail, $patient->email);
            EmailLoggerService::logToFile($validationMail, $patient->email, 'patient_validation');
            
            \Log::info('Sending PatientValidationMail', [
                'to' => $patient->email,
                'subject' => $validationMail->envelope()->subject,
                'patient_id' => $patient->patient_id
            ]);
            Mail::to($patient->email)->send($validationMail);
            \Log::info('PatientValidationMail sent successfully');
        } catch (\Exception $e) {
            \Log::error('Failed to send PatientValidationMail', [
                'error' => $e->getMessage(),
                'patient_id' => $patient->patient_id,
                'email' => $patient->email
            ]);
        }
        
        // Send creation confirmation email
        try {
            $creationMail = new PatientCreatedMail($patient);
            
            // Log full email content
            EmailLoggerService::logEmailContent($creationMail, $patient->email);
            EmailLoggerService::logToFile($creationMail, $patient->email, 'patient_created');
            
            \Log::info('Sending PatientCreatedMail', [
                'to' => $patient->email,
                'subject' => $creationMail->envelope()->subject,
                'patient_id' => $patient->patient_id
            ]);
            Mail::to($patient->email)->send($creationMail);
            \Log::info('PatientCreatedMail sent successfully');
        } catch (\Exception $e) {
            \Log::error('Failed to send PatientCreatedMail', [
                'error' => $e->getMessage(),
                'patient_id' => $patient->patient_id,
                'email' => $patient->email
            ]);
        }

        return to_route('patients.show', ['id' => $patient->patient_id]);
    }
}
