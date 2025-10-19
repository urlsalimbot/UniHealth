<?php

namespace App\Http\Controllers\Patients\Encounters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Models\Patients;
use Inertia\Inertia;
use Inertia\Response;


class ExistingEncounterController extends Controller
{
    public function index($patientId): Response
    {
        $patient = Patients::with([
            'medical_encounters' => function ($q) {
                $q->with(['vital_signs', 'patient_prescriptions', 'attachments'])
                    ->orderBy('encounter_date', 'desc');
            }
        ])->findOrFail($patientId);

        return Inertia::render('patients/encounter-view', [
            'patient' => $patient,
            'medical_encounters' => $patient->medical_encounters,
        ]);
    }
}