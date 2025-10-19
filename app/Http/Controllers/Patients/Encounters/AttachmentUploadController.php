<?php

namespace App\Http\Controllers\Patients\Encounters;

use App\Models\MedicalEncounters;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AttachmentUploadController extends Controller
{
    /**
     * Upload Attachment Endpoint
     */
    public function store(Request $request, $encounterId)
    {
        $request->validate([
            'label' => 'nullable|string|max:255',
            'attachment' => 'required|file|max:10240',
        ]);

        $encounter = MedicalEncounters::findOrFail($encounterId);

        $path = $request->file('attachment')->store('encounter_attachments', 'public');

        $encounter->attachments()->create([
            'label' => $request->label,
            'file_path' => $path,
        ]);

        return back()->with('success', 'Attachment uploaded successfully!');
    }

}