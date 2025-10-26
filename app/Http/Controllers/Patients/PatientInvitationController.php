<?php

namespace App\Http\Controllers\Patients;

use App\Http\Controllers\Controller;
use App\Models\PatientInvitation;
use Illuminate\Http\Request;

class PatientInvitationController extends Controller
{
    public function store(Request $request)
    {
        $invitation = PatientInvitation::generate($request->user()->id);

        $link = route('patients.register.show', $invitation->token);

        return back()
            ->with('success', 'Invitation link generated!')
            ->with('invitation_link', $link);
    }
}