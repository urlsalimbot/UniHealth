<?php

namespace App\Http\Controllers\Patients;

use App\Http\Controllers\Controller;
use App\Models\Patients;
use App\Models\PatientInvitation;
use Illuminate\Http\Request;
use Illuminate\Log\Logger;
use Inertia\Inertia;

class PatientRegistrationController extends Controller
{
    public function showForm($token)
    {
        $invitation = PatientInvitation::where('token', $token)->firstOrFail();

        if ($invitation->isExpired() || $invitation->isUsed()) {
            abort(403, 'This invitation link is invalid or expired.');
        }

        return Inertia::render('patients/register', [
            'token' => $token,
        ]);
    }

    public function submit(Request $request, $token)
    {
        $invitation = PatientInvitation::where('token', $token)->firstOrFail();

        if ($invitation->isExpired() || $invitation->isUsed()) {
            abort(403, 'This invitation link is invalid or expired.');
        }

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
            'gender' => 'required|in:Male,Female,other',
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
            'emergency_contact_address' => 'nullable|string|max:255',

            'data_privacy_consent' => ['accepted'],
        ]);

        if (!empty($validated['data_privacy_consent'])) {
            $validated['data_privacy_consent_date'] = now();
        }

        Patients::create($validated);

        if (!$invitation->isUsed()) {
            $invitation->update(['used_at' => now()]);
        }

        return redirect()->route('home')
            ->with('success', 'Thank you! Your patient record has been created.');
    }
}