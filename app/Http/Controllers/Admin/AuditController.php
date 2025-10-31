<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use OwenIt\Auditing\Models\Audit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditController extends Controller
{
    public function index(Request $request)
    {
        $query = Audit::query()->with('user');

        // Optional filters
        if ($search = $request->input('search')) {
            $query->where('auditable_type', 'like', "%{$search}%")
                ->orWhere('event', 'like', "%{$search}%")
                ->orWhere('user_type', 'like', "%{$search}%");
        }

        if ($model = $request->input('model')) {
            $query->where('auditable_type', $model);
        }

        if ($event = $request->input('event')) {
            $query->where('event', $event);
        }

        $audits = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('admin/audits-index', [
            'audits' => $audits,
            'filters' => $request->only(['search', 'model', 'event']),
        ]);
    }

    public function show(Audit $audit)
    {
        return Inertia::render('admin/audits-show', [
            'audit' => $audit->load('user'),
        ]);
    }
}
