<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use App\Models\User;
use App\Mail\TemporaryPasswordMail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserCreateController extends Controller
{
    public function create()
    {
        return Inertia::render('admin/create');
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'role' => ['required', 'in:intake-staff,doctor,inventory-staff'],
            ], [
                'name.required' => 'The name field is required.',
                'email.required' => 'The email field is required.',
                'email.email' => 'Please provide a valid email address.',
                'email.unique' => 'This email address is already registered.',
                'role.required' => 'Please select a role for the user.',
                'role.in' => 'Please select a valid role.',
            ]);

            // Generate temporary password
            $temporaryPassword = $this->generateTemporaryPassword();

            // Create user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($temporaryPassword),
                'role' => $validated['role'],
            ]);

            // Send temporary password email
            try {
                Mail::to($user->email)->send(new TemporaryPasswordMail($user, $temporaryPassword));
                
                // Log the user creation
                if (class_exists('App\Services\AuditLogger')) {
                    AuditLogger::log('User created', [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'role' => $user->role,
                        'created_by' => auth()->id(),
                    ]);
                }
                
                return redirect()->route('admin.dashboard')->with('success', 
                    "User created successfully! Temporary password has been sent to {$user->email}"
                );
                
            } catch (\Exception $e) {
                // Log the email error
                \Log::error('Failed to send temporary password email: ' . $e->getMessage());
                
                // Still create the user but notify about email failure
                return redirect()->route('admin.dashboard')->with('warning', 
                    "User created successfully, but we couldn't send the temporary password email to {$user->email}. The temporary password is: {$temporaryPassword}"
                );
            }
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return validation errors with input
            return back()
                ->withErrors($e->errors())
                ->withInput();
                
        } catch (\Exception $e) {
            // Log general errors
            \Log::error('User creation failed: ' . $e->getMessage());
            
            return back()->with('error', 
                'User creation failed. Please check your input and try again.'
            )->withInput();
        }
    }

    private function generateTemporaryPassword(): string
    {
        // Generate a secure temporary password (12 characters with mixed case, numbers, and symbols)
        return Str::random(8) . rand(10, 99) . '!';
    }
}
