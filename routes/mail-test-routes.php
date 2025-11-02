<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Test email configuration
Route::get('/mail-test', function () {
    try {
        $config = [
            'driver' => config('mail.default'),
            'host' => config('mail.mailers.smtp.host'),
            'port' => config('mail.mailers.smtp.port'),
            'from' => config('mail.from.address'),
            'from_name' => config('mail.from.name'),
        ];
        
        return response()->json([
            'status' => 'Mail configuration',
            'config' => $config,
            'mailhog_url' => 'http://localhost:8025',
            'message' => 'If MailHog is running, visit the URL above to see emails'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
});

// Send test email
Route::post('/mail-test/send', function (Request $request) {
    try {
        $request->validate([
            'email' => 'required|email'
        ]);
        
        $user = new class {
            public $name = 'Test User';
            public $email;
        };
        $user->email = $request->email;
        
        $temporaryPassword = 'TestTemp123!';
        
        Mail::to($user->email)->send(new \App\Mail\TemporaryPasswordMail($user, $temporaryPassword));
        
        return response()->json([
            'success' => true,
            'message' => 'Test email sent! Check MailHog at http://localhost:8025',
            'email_sent_to' => $user->email,
            'temp_password' => $temporaryPassword
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => collect($e->getTrace())->take(5)->toArray()
        ], 500);
    }
});
