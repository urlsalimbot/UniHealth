<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\MedicationRequest;
use App\Models\Medications;
use App\Models\FacilityMedicationInventory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Carbon\Carbon;

class InventoryDashboardController extends Controller
{
    /**
     * Display a comprehensive inventory dashboard with integrated low stock alerts.
     * 
     * Features:
     * - Enhanced medication request pooling with status filtering
     * - Real-time inventory analytics and statistics
     * - Integrated low stock alerts with urgency calculation
     * - Recent activity tracking with error handling
     * - Optimized queries with caching for better performance
     * 
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Validate input parameters
        $validated = $request->validate([
            'per_page' => 'sometimes|integer|min:5|max:100',
            'page' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:all,pending,approved,fulfilled,rejected',
            'sort' => 'sometimes|string',
            'direction' => 'sometimes|in:asc,desc',
            'refresh' => 'sometimes|boolean',
        ]);

        // Cache duration for dashboard data
        $cacheDuration = $validated['refresh'] ?? false ? 0 : 300; // 5 minutes or refresh
        
        // Get dashboard analytics with caching
        $dashboardData = Cache::remember('inventory_dashboard_data', $cacheDuration, function () use ($validated) {
            return [
                'stats' => $this->getInventoryStats(),
                'lowStockAlerts' => $this->getLowStockAlerts(), // Renamed to match admin pattern
                'expiringSoon' => $this->getExpiringMedications(),
                'recentActivity' => $this->getRecentActivity(), // Renamed to match admin pattern
                'medications' => $this->getAllMedications(),
                'currInventory' => $this->getInventoryData($validated), // Renamed to match admin pattern
                'requests' => $this->getMedicationRequests($validated),
            ];
        });

        return Inertia::render('inventory/inventory-index', array_merge($dashboardData, [
            'filters' => $validated,
            'meta' => [
                'title' => 'Inventory Dashboard',
                'description' => 'Manage medications, stock levels, and requests',
                'last_updated' => now()->toISOString(),
                'version' => '2.0'
            ]
        ]));
    }

    /**
     * Get comprehensive inventory statistics
     */
    private function getInventoryStats()
    {
        return [
            'total_medications' => Medications::count(),
            'total_inventory_value' => FacilityMedicationInventory::sum('total_value'),
            'critical_stock_count' => FacilityMedicationInventory::whereColumn('current_stock', '<', 'reorder_point')->count(),
            'expiring_soon_count' => FacilityMedicationInventory::where('expiration_date', '<=', now()->addDays(90))->count(),
            'facility_count' => FacilityMedicationInventory::distinct('facility_id')->count('facility_id'),
            'request_summary' => $this->getRequestSummary(),
        ];
    }

    /**
     * Get request summary statistics
     */
    private function getRequestSummary()
    {
        return [
            'pending' => MedicationRequest::where('status', 'pending')->count(),
            'approved' => MedicationRequest::where('status', 'approved')->count(),
            'fulfilled' => MedicationRequest::where('status', 'fulfilled')->count(),
            'rejected' => MedicationRequest::where('status', 'rejected')->count(),
            'total' => MedicationRequest::count(),
        ];
    }

    /**
     * Get low stock alerts with detailed information (Admin-style)
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
                    'medication_id' => $item->medication_id,
                    'lot_number' => $item->lot_number,
                    'expiration_date' => $item->expiration_date,
                    'days_until_expiry' => Carbon::parse($item->expiration_date)->diffInDays(now()),
                    'current_stock' => $item->current_stock,
                ];
            });
    }

    /**
     * Get recent medication request activity
     */
    private function getRecentActivity()
    {
        return MedicationRequest::with(['patient', 'reviewer'])
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($request) {
                try {
                    $patient_name = $request->patient ? 
                        "{$request->patient->last_name}, {$request->patient->first_name}" : 
                        'Unknown Patient';
                    
                    $user = $request->reviewer_id ? User::find($request->reviewer_id) : null;
                    
                    return [
                        'id' => $request->id,
                        'type' => 'medication_request',
                        'action' => $request->status,
                        'description' => "Request #{$request->id} {$request->status}",
                        'patient_name' => $patient_name,
                        'timestamp' => $request->updated_at,
                        'user' => $user?->name ?? 'System',
                    ];
                } catch (\Exception $e) {
                    Log::error('Error processing recent activity: ' . $e->getMessage());
                    return [
                        'id' => $request->id,
                        'type' => 'medication_request',
                        'action' => $request->status ?? 'unknown',
                        'description' => "Request #{$request->id}",
                        'patient_name' => 'Unknown',
                        'timestamp' => $request->updated_at ?? now(),
                        'user' => 'System',
                    ];
                }
            });
    }

    /**
     * Get all medications (no pagination)
     */
    private function getAllMedications()
    {
        return Medications::select()
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get paginated inventory data with filtering
     */
    private function getInventoryData($validated)
    {
        $inventoryPerPage = $validated['per_page'] ?? 10;
        $inventoryPage = $validated['page'] ?? 1;
        $inventorySort = $validated['sort'] ?? 'total_stock';
        $inventoryDirection = $validated['direction'] ?? 'desc';

        return FacilityMedicationInventory::with('medication')
            ->selectRaw('
                medication_id,
                SUM(current_stock) as total_stock,
                SUM(reorder_point) as total_reorder_point,
                SUM(minimum_stock_level) as total_minimum_stock_level,
                SUM(maximum_stock_level) as total_maximum_stock_level,
                COUNT(DISTINCT facility_id) as facility_count,
                MAX(created_at) as latest_update,
                MIN(expiration_date) as nearest_expiry,
                COUNT(CASE WHEN expiration_date <= DATE("now", "+90 days") THEN 1 END) as expiring_soon_count
            ')
            ->groupBy('medication_id')
            ->orderBy($inventorySort, $inventoryDirection)
            ->paginate($inventoryPerPage, ['*'], 'page', $inventoryPage);
    }

    /**
     * Get medication requests with filtering
     */
    private function getMedicationRequests($validated)
    {
        $statusFilter = $validated['status'] ?? 'all';

        $requestsQuery = MedicationRequest::with(['patient', 'reviewer'])
            ->selectRaw('
                *,
                CASE 
                    WHEN status = "pending" THEN 1
                    WHEN status = "approved" THEN 2
                    WHEN status = "fulfilled" THEN 3
                    WHEN status = "rejected" THEN 4
                    ELSE 5
                END as status_priority
            ');

        // Apply status filter
        if ($statusFilter !== 'all') {
            $requestsQuery->where('status', $statusFilter);
        }

        return $requestsQuery->orderBy('status_priority', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Refresh dashboard cache
     */
    public function refresh()
    {
        Cache::forget('inventory_dashboard_data');
        return redirect()->route('inventory.index', ['refresh' => true]);
    }

    public function patientIndex()
    {
        /**
         * 💊 LOAD ALL MEDICATIONS (no pagination)
         */
        $medications = Medications::select([
            'medication_id',
            'generic_name',
            'brand_names',
            'strength',
            'dosage_form',
            'drug_class',
            'created_at',
        ])
            ->orderBy('created_at', 'desc')
            ->get(); // ✅ no pagination here



        return Inertia::render('inventory/indexp', [
            'medications' => $medications, // ✅ all meds (no pagination)
        ]);
    }

}