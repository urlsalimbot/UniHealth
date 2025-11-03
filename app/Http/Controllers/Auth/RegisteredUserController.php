<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Patients;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        Log::info('Registration attempt', [
            'email' => $request->email,
            'has_patient_id' => $request->filled('patient_id'),
            'patient_id' => $request->patient_id,
        ]);

        // Validate basic fields
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'patient_id' => 'required|uuid',
        ]);

        // Validate patient_id and lookup patient
        $patient = Patients::where('patient_id', $request->patient_id)->first();

        if (!$patient) {
            Log::warning('Patient not found', ['patient_id' => $request->patient_id]);
            return back()->withErrors([
                'patient_id' => 'No matching patient record found. Please verify your UHID or contact the clinic.',
            ])->onlyInput('name', 'email');
        }

        Log::info('Patient found', [
            'patient_id' => $patient->patient_id,
            'patient_name' => $patient->first_name . ' ' . $patient->last_name,
        ]);

        // Create user with patient role
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => User::ROLE_PTNT,
            'patient_id' => $patient->patient_id,
        ]);

        Log::info('User created successfully', ['user_id' => $user->id]);

        event(new Registered($user));
        Auth::login($user);

        Log::info('User logged in, redirecting', ['patient_id' => $user->patient_id]);

        return redirect()->route('patients.show', $user->patient_id);
    }
}
