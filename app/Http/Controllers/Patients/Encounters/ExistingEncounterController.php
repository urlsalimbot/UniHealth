<?php

namespace App\Http\Controllers\Patients\Encounters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
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

        $vitalsigns = $patient->vital_signs()->orderBy('measurement_date', 'desc')->get();

        // Ensure attachments have valid URLs
        $patient->medical_encounters->each(function ($encounter) {
            $encounter->attachments->each(function ($attachment) {
                if ($attachment->file_path && Storage::disk('public')->exists($attachment->file_path)) {
                    /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                    $disk = Storage::disk('public');
                    $attachment->url = $disk->url($attachment->file_path);
                } else {
                    $attachment->url = null;
                }
            });
        });

        return Inertia::render('patients/encounter-view', [
            'patient' => $patient,
            'vitalsigns' => $vitalsigns,
            'medical_encounters' => $patient->medical_encounters,
        ]);
    }
}