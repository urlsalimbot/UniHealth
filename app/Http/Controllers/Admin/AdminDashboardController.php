<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MedicalEncounters;
use App\Models\FacilityMedicationInventory;
use App\Models\VitalSigns;
use App\Models\Patients;
use App\Models\User;
use App\Models\Medications;
use App\Models\PatientPrescriptions;
use DB;
use App\Services\AuditLogger;
use App\Models\Audit;
use App\Notifications\AuditEventNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    /**
     * Show the admin dashboard with comprehensive analytics.
     */
    public function index(Request $request)
    {
        // Cache duration for dashboard data
        $cacheDuration = $request->get('refresh', false) ? 0 : 300; // 5 minutes or refresh
        
        // Get dashboard analytics with caching
        $dashboardData = Cache::remember('admin_dashboard_data', $cacheDuration, function () {
            return [
                'encounters' => $this->getEncounterStats(),
                'visitsLast7Days' => $this->getVisitsLast7Days(),
                'maxWeeklyVisits' => $this->getMaxWeeklyVisits(),
                'lowStocks' => $this->getLowStockAlerts(),
                'triageUrgency' => $this->getTriageUrgencyStats(),
                'patientStats' => $this->getPatientStats(),
                'medicationStats' => $this->getMedicationStats(),
                'prescriptionStats' => $this->getPrescriptionStats(),
                'staffStats' => $this->getStaffStats(),
                'expiringSoon' => $this->getExpiringMedications(),
                'recentActivities' => $this->getRecentActivities(),
            ];
        });

        return Inertia::render('dashboard', $dashboardData);
    }

    /**
     * Get encounter statistics with trends
     */
    private function getEncounterStats()
    {
        return MedicalEncounters::select('encounter_id', 'encounter_date', 'encounter_type', 'encounter_status')
            ->orderBy('encounter_date', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($encounter) {
                return [
                    'id' => $encounter->encounter_id,
                    'date' => $encounter->encounter_date,
                    'type' => $encounter->encounter_type,
                    'status' => $encounter->encounter_status,
                    'date_formatted' => Carbon::parse($encounter->encounter_date)->format('M j, Y'),
                ];
            });
    }

    /**
     * Get visits in the last 7 days with daily breakdown
     */
    private function getVisitsLast7Days()
    {
        $visits = MedicalEncounters::where('encounter_date', '>=', now()->subDays(7))
            ->selectRaw('DATE(encounter_date) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'total' => $visits->sum('count'),
            'daily' => $visits->map(function ($day) {
                return [
                    'date' => $day->date,
                    'count' => $day->count,
                    'day_name' => Carbon::parse($day->date)->format('D'),
                ];
            }),
        ];
    }

    /**
     * Get maximum weekly visits from the last 30 days
     */
    private function getMaxWeeklyVisits()
    {
        return MedicalEncounters::where('encounter_date', '>=', now()->subDays(30))
            ->selectRaw('DATE(encounter_date) as day, COUNT(*) as count')
            ->groupBy('day')
            ->orderByDesc('count')
            ->limit(1)
            ->value('count') ?? 1;
    }

    /**
     * Get low stock alerts with detailed information
     */
    private function getLowStockAlerts()
    {
        return FacilityMedicationInventory::with(['medication', 'healthcare_facilities'])
            ->whereColumn('current_stock', '<', 'reorder_point')
            ->where('stock_status', FacilityMedicationInventory::STATUS_ACTIVE)
            ->orderByRaw('(current_stock / NULLIF(reorder_point, 0)) ASC')
            ->limit(20)
            ->get()
            ->map(function ($item) {
                return [
                    'inventory_id' => $item->inventory_id,
                    'medication_id' => $item->medication_id,
                    'current_stock' => $item->current_stock,
                    'minimum_stock_level' => $item->minimum_stock_level,
                    'reorder_point' => $item->reorder_point,
                    'maximum_stock_level' => $item->maximum_stock_level,
                    'lot_number' => $item->lot_number,
                    'expiration_date' => $item->expiration_date,
                    'medication' => [
                        'generic_name' => $item->medication->generic_name ?? 'Unknown',
                        'brand_names' => $item->medication->brand_names ?? null,
                        'strength' => $item->medication->strength ?? null,
                        'dosage_form' => $item->medication->dosage_form ?? null,
                    ],
                    'facility' => [
                        'name' => $item->healthcare_facilities->name ?? 'Unknown Facility',
                    ],
                ];
            });
    }

    /**
     * Get triage urgency statistics with improved logic
     */
    private function getTriageUrgencyStats()
    {
        // Get latest vital signs for each patient from the last 24 hours
        $latestVitals = VitalSigns::select('patient_id', DB::raw('MAX(created_at) as latest_time'))
            ->where('created_at', '>=', now()->subHours(24))
            ->groupBy('patient_id');

        $vitals = VitalSigns::joinSub($latestVitals, 'latest', function ($join) {
            $join->on('vital_signs.patient_id', '=', 'latest.patient_id')
                ->on('vital_signs.created_at', '=', 'latest.latest_time');
        })
            ->select('vital_signs.*')
            ->get();

        $urgencyCounts = [
            'Critical' => 0,
            'High' => 0,
            'Moderate' => 0,
            'Low' => 0,
        ];

        foreach ($vitals as $v) {
            $level = $this->calculateTriageLevel($v);
            $urgencyCounts[$level]++;
        }

        return $urgencyCounts;
    }

    /**
     * Calculate triage level based on vital signs
     */
    private function calculateTriageLevel($vitals): string
    {
        // Critical conditions
        if (
            $vitals->heart_rate < 40 || $vitals->heart_rate > 130 ||
            $vitals->systolic_bp < 80 || $vitals->systolic_bp > 180 ||
            $vitals->temperature > 39 || $vitals->temperature < 35 ||
            $vitals->respiratory_rate < 8 || $vitals->respiratory_rate > 30 ||
            $vitals->oxygen_saturation < 90
        ) {
            return 'Critical';
        }

        // High urgency
        if (
            ($vitals->heart_rate >= 110 && $vitals->heart_rate <= 130) ||
            ($vitals->systolic_bp >= 160 && $vitals->systolic_bp <= 180) ||
            ($vitals->temperature >= 38 && $vitals->temperature < 39) ||
            ($vitals->respiratory_rate >= 25 && $vitals->respiratory_rate < 30) ||
            ($vitals->oxygen_saturation >= 90 && $vitals->oxygen_saturation <= 93)
        ) {
            return 'High';
        }

        // Moderate urgency
        if (
            ($vitals->heart_rate >= 100 && $vitals->heart_rate < 110) ||
            ($vitals->systolic_bp >= 140 && $vitals->systolic_bp < 160) ||
            ($vitals->temperature >= 37.5 && $vitals->temperature < 38) ||
            ($vitals->respiratory_rate >= 20 && $vitals->respiratory_rate < 25) ||
            ($vitals->oxygen_saturation >= 94 && $vitals->oxygen_saturation < 96)
        ) {
            return 'Moderate';
        }

        return 'Low';
    }

    /**
     * Get patient statistics
     */
    private function getPatientStats()
    {
        return [
            'total' => Patients::count(),
            'active' => Patients::where('is_active', true)->count(),
            'new_this_month' => Patients::where('created_at', '>=', now()->startOfMonth())->count(),
            'with_encounters' => Patients::whereHas('medical_encounters')->count(),
        ];
    }

    /**
     * Get medication statistics
     */
    private function getMedicationStats()
    {
        return [
            'total' => Medications::count(),
            'controlled' => Medications::where('controlled_substance', true)->count(),
            'low_stock' => FacilityMedicationInventory::whereColumn('current_stock', '<', 'reorder_point')->count(),
            'total_inventory_value' => FacilityMedicationInventory::sum('total_value'),
        ];
    }

    /**
     * Get prescription statistics
     */
    private function getPrescriptionStats()
    {
        return [
            'total' => PatientPrescriptions::count(),
            'active' => PatientPrescriptions::where('prescription_status', 'Active')->count(),
            'this_month' => PatientPrescriptions::where('prescription_date', '>=', now()->startOfMonth())->count(),
        ];
    }

    /**
     * Get staff statistics
     */
    private function getStaffStats()
    {
        return [
            'total' => User::count(),
            'administrators' => User::where('role', 'administrator')->count(),
            'doctors' => User::where('role', 'health-staff')->count(),
            'nurses' => User::where('role', 'intake-staff')->count(),
            'pharmacy' => User::where('role', 'inventory-staff')->count(),
        ];
    }

    /**
     * Get medications expiring soon (within 90 days)
     */
    private function getExpiringMedications()
    {
        return FacilityMedicationInventory::with('medication')
            ->where('expiration_date', '<=', now()->addDays(90))
            ->where('expiration_date', '>', now())
            ->where('current_stock', '>', 0)
            ->orderBy('expiration_date')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'inventory_id' => $item->inventory_id,
                    'medication_name' => $item->medication->generic_name ?? 'Unknown',
                    'lot_number' => $item->lot_number,
                    'expiration_date' => $item->expiration_date,
                    'days_until_expiry' => Carbon::parse($item->expiration_date)->diffInDays(now()),
                    'current_stock' => $item->current_stock,
                ];
            });
    }

    /**
     * Get recent activities from various sources
     */
    private function getRecentActivities()
    {
        $activities = collect();

        // Get recent encounters (last 24 hours)
        $recentEncounters = MedicalEncounters::with(['patient'])
            ->where('created_at', '>=', now()->subHours(24))
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($encounter) {
                return [
                    'id' => $encounter->encounter_id,
                    'type' => 'encounter',
                    'title' => 'New Patient Encounter',
                    'description' => ($encounter->encounter_type ?? 'Consultation') . ' - ' . 
                                   ($encounter->patient->first_name ?? 'Patient') . ' ' . 
                                   ($encounter->patient->last_name ?? ''),
                    'timestamp' => $encounter->created_at->toISOString(),
                    'status' => $encounter->encounter_status ?? 'completed',
                ];
            });

        // Get recent patient registrations (last 24 hours)
        $recentPatients = Patients::where('created_at', '>=', now()->subHours(24))
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($patient) {
                return [
                    'id' => $patient->patient_id,
                    'type' => 'patient',
                    'title' => 'New Patient Registration',
                    'description' => ($patient->first_name ?? '') . ' ' . 
                                   ($patient->last_name ?? '') . ' registered as a new patient',
                    'timestamp' => $patient->created_at->toISOString(),
                    'status' => 'completed',
                ];
            });

        // Get recent prescriptions (last 24 hours)
        $recentPrescriptions = PatientPrescriptions::with(['patient', 'medication'])
            ->where('created_at', '>=', now()->subHours(24))
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($prescription) {
                return [
                    'id' => $prescription->prescription_id,
                    'type' => 'prescription',
                    'title' => 'Prescription Issued',
                    'description' => ($prescription->medication->generic_name ?? 'Medication') . ' prescribed for ' .
                                   ($prescription->patient->first_name ?? 'Patient') . ' ' .
                                   ($prescription->patient->last_name ?? ''),
                    'timestamp' => $prescription->created_at->toISOString(),
                    'status' => strtolower($prescription->prescription_status ?? 'completed'),
                ];
            });

        // Get recent vital signs (last 24 hours)
        $recentVitals = VitalSigns::with(['patient'])
            ->where('created_at', '>=', now()->subHours(24))
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($vital) {
                return [
                    'id' => $vital->vital_sign_id,
                    'type' => 'encounter',
                    'title' => 'Vital Signs Recorded',
                    'description' => 'Vital signs updated for ' .
                                   ($vital->patient->first_name ?? 'Patient') . ' ' .
                                   ($vital->patient->last_name ?? ''),
                    'timestamp' => $vital->created_at->toISOString(),
                    'status' => 'completed',
                ];
            });

        // Merge all activities and sort by timestamp
        $activities = $activities
            ->merge($recentEncounters)
            ->merge($recentPatients)
            ->merge($recentPrescriptions)
            ->merge($recentVitals)
            ->sortByDesc('timestamp')
            ->take(10)
            ->values();

        return $activities;
    }

    /**
     * Refresh dashboard cache
     */
    public function refresh()
    {
        Cache::forget('admin_dashboard_data');
        return redirect()->route('admin.dashboard', ['refresh' => true]);
    }
}
