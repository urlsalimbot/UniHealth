<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\MedicationRequest;

class MedicationRequestFulfilledMail extends Mailable
{
    use Queueable, SerializesModels;

    public MedicationRequest $request;

    public function __construct(MedicationRequest $request)
    {
        $this->request = $request;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Medication Request Has Been Fulfilled',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.medication-request-fulfilled',
            with: [
                'request' => $this->request,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
