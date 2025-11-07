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
        $patients = QueryBuilder::for(Patients::class)
            ->allowedFilters([
                AllowedFilter::partial('first_name'),
                AllowedFilter::partial('last_name'),
                AllowedFilter::partial('email'),
                AllowedFilter::partial('mobile_number'),
                AllowedFilter::exact('date_of_birth'),
            ])
            ->defaultSort('-created_at')
            ->paginate(10)
            ->appends($request->query());

        return Inertia::render('patients/index', [
            'patient' => $patients,
            'filters' => $request->input('filter', []), // always defined
        ]);
    }


}
