<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Mail\Mailable;

class EmailLoggerService
{
    /**
     * Log the full email content before sending
     */
    public static function logEmailContent(Mailable $mailable, string $to): void
    {
        try {
            // Get email details
            $envelope = $mailable->envelope();
            $content = $mailable->content();
            
            // Log email metadata
            Log::info('Email Content Dump', [
                'to' => $to,
                'subject' => $envelope->subject,
                'from' => config('mail.from.address'),
                'from_name' => config('mail.from.name'),
                'view' => $content->view,
                'timestamp' => now()->toISOString()
            ]);
            
            // Try to render the email content for logging
            try {
                $renderedContent = $mailable->render();
                
                Log::info('Full Email HTML Content', [
                    'to' => $to,
                    'subject' => $envelope->subject,
                    'content_length' => strlen($renderedContent),
                    'content_preview' => substr($renderedContent, 0, 500) . '...',
                    'full_content' => $renderedContent // Full content in log
                ]);
            } catch (\Exception $renderException) {
                Log::warning('Could not render email content for logging', [
                    'error' => $renderException->getMessage(),
                    'to' => $to,
                    'subject' => $envelope->subject
                ]);
            }
            
        } catch (\Exception $e) {
            Log::error('Failed to log email content', [
                'error' => $e->getMessage(),
                'to' => $to
            ]);
        }
    }
    
    /**
     * Create a dedicated email log file
     */
    public static function logToFile(Mailable $mailable, string $to, string $logType = 'email'): void
    {
        try {
            $envelope = $mailable->envelope();
            $content = $mailable->render();
            
            $logEntry = [
                'timestamp' => now()->toISOString(),
                'type' => $logType,
                'to' => $to,
                'subject' => $envelope->subject,
                'from' => config('mail.from.address'),
                'content' => $content
            ];
            
            $logContent = json_encode($logEntry, JSON_PRETTY_PRINT) . "\n" . str_repeat('-', 80) . "\n\n";
            
            // Write to dedicated email log file
            file_put_contents(
                storage_path('logs/emails.log'),
                $logContent,
                FILE_APPEND | LOCK_EX
            );
            
        } catch (\Exception $e) {
            Log::error('Failed to write email to dedicated log file', [
                'error' => $e->getMessage(),
                'to' => $to
            ]);
        }
    }
}
