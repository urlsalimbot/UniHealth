<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Patients;
use App\Services\QrCodeService;

class PatientValidationMail extends Mailable
{
    use Queueable, SerializesModels;

    public Patients $patient;
    public string $qrCodeUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(Patients $patient)
    {
        $this->patient = $patient;
        
        // Ensure patient_id exists, use a temporary ID if not set yet
        $patientId = $patient->patient_id ?? 'temp-' . uniqid();
        $this->qrCodeUrl = QrCodeService::generatePatientQrCode($patientId);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Patient Information Validation - UniHealth',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.patient-validation',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
