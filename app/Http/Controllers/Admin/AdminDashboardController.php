<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MedicalEncounters;
use App\Models\FacilityMedicationInventory;
use App\Models\VitalSigns;
use DB;
use App\Services\AuditLogger;
use App\Models\User;
use App\Models\Audit;
use App\Notifications\AuditEventNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    /**
     * Show the admin dashboard with list of users/staff.
     */
    public function index()
    {
        $encounters = MedicalEncounters::select('encounter_id', 'encounter_date')->get();

        $visitsLast7Days = MedicalEncounters::where('encounter_date', '>=', now()->subDays(7))->count();

        $maxWeeklyVisits = MedicalEncounters::where('encounter_date', '>=', now()->subDays(30))
            ->selectRaw('DATE(encounter_date) as day, COUNT(*) as count')
            ->groupBy('day')
            ->orderByDesc('count')
            ->limit(1)
            ->value('count') ?? 1;

        $lowStocks = FacilityMedicationInventory::with('medication')
            ->whereColumn('current_stock', '<', 'reorder_point')
            ->get();

        // 🧠 Get latest vital signs for each patient
        $latestVitals = VitalSigns::select('patient_id', DB::raw('MAX(created_at) as latest_time'))
            ->groupBy('patient_id');

        $vitals = VitalSigns::joinSub($latestVitals, 'latest', function ($join) {
            $join->on('vital_signs.patient_id', '=', 'latest.patient_id')
                ->on('vital_signs.created_at', '=', 'latest.latest_time');
        })
            ->select('vital_signs.*')
            ->get();

        // 🩺 Determine urgency
        $urgencyCounts = [
            'Critical' => 0,
            'High' => 0,
            'Moderate' => 0,
            'Low' => 0,
        ];

        foreach ($vitals as $v) {
            $level = 'Low';
            if ($v->heart_rate < 40 || $v->heart_rate > 130 || $v->systolic_bp < 80 || $v->systolic_bp > 180 || $v->temperature > 39 || $v->temperature < 35 || $v->respiratory_rate < 8 || $v->respiratory_rate > 30 || $v->oxygen_saturation < 90) {
                $level = 'Critical';
            } elseif (
                ($v->heart_rate >= 110 && $v->heart_rate <= 130) || ($v->systolic_bp >= 160 && $v->systolic_bp <= 180) ||
                ($v->temperature >= 38 && $v->temperature < 39) || ($v->respiratory_rate >= 25 && $v->respiratory_rate < 30) || ($v->oxygen_saturation >= 90 && $v->oxygen_saturation <= 93)
            ) {
                $level = 'High';
            } elseif (
                ($v->heart_rate >= 100 && $v->heart_rate < 110) || ($v->systolic_bp >= 140 && $v->systolic_bp < 160) ||
                ($v->temperature >= 37.5 && $v->temperature < 38) || ($v->respiratory_rate >= 20 && $v->respiratory_rate < 25) || ($v->oxygen_saturation >= 94 && $v->oxygen_saturation < 96)
            ) {
                $level = 'Moderate';
            }

            $urgencyCounts[$level]++;
        }

        return Inertia::render('dashboard', [
            'encounters' => $encounters,
            'visitsLast7Days' => $visitsLast7Days,
            'maxWeeklyVisits' => $maxWeeklyVisits,
            'lowStocks' => $lowStocks,
            'triageUrgency' => $urgencyCounts,
        ]);
    }
}
