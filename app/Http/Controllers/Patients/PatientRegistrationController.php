<?php

namespace App\Http\Controllers\Patients;

use App\Http\Controllers\Controller;
use App\Models\Patients;
use App\Models\PatientInvitation;
use Illuminate\Http\Request;
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
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'birth_date' => 'nullable|date',
            'email' => 'nullable|email',
        ]);

        Patients::create($validated);

        $invitation->update(['used_at' => now()]);

        return redirect()->route('patients.register.show', $token)
            ->with('success', 'Thank you! Your patient record has been created.');
    }
}