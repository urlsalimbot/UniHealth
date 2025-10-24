<?php

namespace App\Http\Controllers\Patients\Encounters;

use App\Models\EncounterAttachments;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Log;

class AttachmentUploadController extends Controller
{
    /**
     * Upload Attachment Endpoint
     */
    public function store(Request $request, $id, $encounter)
    {
        $request->validate([
            'label' => 'nullable|string|max:255',
            'attachment' => 'required|file|max:10240',
        ]);

        $path = $request->file('attachment')->store('encounter_attachments', 'public');

        $attachment = EncounterAttachments::create([
            'encounter_id' => $encounter,
            'label' => $request->input('label'),
            'file_path' => $path,
        ]);

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');
        $attachment->url = $disk->url($path);

        return response()->json([
            'message' => 'Attachment uploaded successfully!',
            'attachment' => $attachment,
        ]);
    }

}