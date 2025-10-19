<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MedicalEncounters;
use App\Services\AuditLogger;
use App\Models\User;
use App\Models\Audit;
use App\Notifications\AuditEventNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Show the admin dashboard with list of users/staff.
     */
    public function index()
    {
        $encounters = MedicalEncounters::select('encounter_id', 'encounter_date')->get();

        return Inertia::render('dashboard', [
            'encounters' => $encounters,
        ]);
    }
}
