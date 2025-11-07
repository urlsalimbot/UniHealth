<?php

namespace App\Http\Controllers\Patients;

use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Filters\PatientFilter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Models\Patients;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;


class PatientsIndexController extends Controller
{
    public function index(Request $request)
    {
        $total = Patients::Count();

        // Build the query with Spatie QueryBuilder
        $patients = QueryBuilder::for(Patients::class)
            // Define allowed filters
            ->allowedFilters([
                AllowedFilter::partial('first_name'),
                AllowedFilter::partial('last_name'),
                AllowedFilter::partial('email'),
                AllowedFilter::partial('mobile_number'),
                AllowedFilter::exact('date_of_birth'),
                  // ✅ New Between Date Filters
                AllowedFilter::callback('created_at_from', function ($query, $value) {
                    $query->whereDate('created_at', '>=', $value);
            }),
                AllowedFilter::callback('created_at_to', function ($query, $value) {
                    $query->whereDate('created_at', '<=', $value);
            }),

            ])
            // Define allowed sorts
            ->allowedSorts([
                'first_name',
                'last_name',
                'email',
                'mobile_number',
                'date_of_birth',
                'created_at',
                'updated_at',
            ])
            // Default sort if none specified
            ->defaultSort('-created_at')
            // Paginate results
            ->paginate($request->input('per_page', 10))
            ->appends($request->query());

        // Extract filters and sorts from request for frontend
        $filters = collect($request->input('filter', []))
            ->filter(fn($value) => !empty($value))
            ->toArray();

        $sorts = $request->has('sort') 
            ? (is_array($request->input('sort')) 
                ? $request->input('sort') 
                : explode(',', $request->input('sort')))
            : [];

        return Inertia::render('patients/index', [
            'totalpatients' => $total,
            'patient' => $patients,
            'filters' => $filters,
            'sorts' => $sorts,
        ])->with('success','Patients loaded');
    }
}

