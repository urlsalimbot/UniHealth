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
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:staff,user',
            'philhealth_id' => 'nullable|string',
        ]);

        $patientId = null;

        // Only enforce patient check if role = "user"
        if ($request->role === User::ROLE_PTNT) {
            $request->validate([
                'philhealth_id' => 'required|string',
            ]);

            $patient = Patients::whereRaw('LOWER(philhealth_id) = ?', [strtolower($request->philhealth_id)])->first();

            if (!$patient) {
                return back()->withErrors([
                    'philhealth_id' => 'No matching patient record found. Please contact the clinic.',
                ])->onlyInput('name', 'email');
            }

            // ✅ Correct key name for your model
            $patientId = $patient->patient_id;
        }

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'patient',
            'patient_id' => $patientId,
        ]);

        event(new Registered($user));
        Auth::login($user);

        if ($patientId !== null) {
            return redirect()->route('patients.show', $user->patient_id);
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
