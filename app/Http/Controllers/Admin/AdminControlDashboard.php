<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use App\Models\User;
use App\Models\Audit;
use App\Notifications\AuditEventNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminControlDashboard extends Controller
{
    /**
     * Show the admin dashboard with list of users/staff.
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Filtering
        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        // Sorting
        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');
        $query->orderBy($sort, $direction);

        // Paginate
        $users = $query->paginate($request->get('per_page', 10))
            ->appends($request->query());

        return Inertia::render('admin/admin-dashboard', [
            'users' => $users,
            'filters' => $request->only(['name', 'sort', 'direction', 'per_page']),
        ]);
    }

    /**
     * Delete a user or staff account.
     */
    public function destroy(User $user)
    {
        if ($user->role === User::ROLE_ADMIN) {
            abort(403, 'Cannot delete administrator accounts.');
        }

        $user->delete();

        // ✅ Log the deletion
        $audit = AuditLogger::log('USER_DELETED', 'User', $user->id, [
            'deleted_by' => Auth::id(),
            'deleted_name' => Auth::user()->name,
            'role' => $user->role,
        ]);

        // ✅ Notify all admins about the deletion
        $admins = User::where('role', User::ROLE_ADMIN)->get();
        Notification::send($admins, new AuditEventNotification($audit));

        return redirect()->back()->with('success', 'User deleted and audit logged.');
    }
}
