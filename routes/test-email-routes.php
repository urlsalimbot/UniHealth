<?php

use Illuminate\Support\Facades\Route;

Route::get('/test-email', function () {
    // Test email configuration
    try {
        $transport = app('mailer')->getSymfonyTransport();
        $config = [
            'driver' => config('mail.default'),
            'host' => config('mail.mailers.smtp.host'),
            'port' => config('mail.mailers.smtp.port'),
            'from' => config('mail.from'),
        ];
        
        return response()->json([
            'status' => 'Mail configuration loaded',
            'config' => $config,
            'message' => 'MailHog should be running on http://localhost:8025'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'config' => config('mail')
        ], 500);
    }
});

Route::post('/test-send-email', function () {
    try {
        $user = new stdClass();
        $user->name = 'Test User';
        $user->email = 'test@example.com';
        
        $temporaryPassword = 'TestPass123!';
        
        \Mail::to($user->email)->send(new \App\Mail\TemporaryPasswordMail($user, $temporaryPassword));
        
        return response()->json([
            'success' => true,
            'message' => 'Test email sent! Check MailHog at http://localhost:8025',
            'email' => $user->email,
            'password' => $temporaryPassword
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});
