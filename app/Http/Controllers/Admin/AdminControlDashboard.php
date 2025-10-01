<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
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

        // Paginate (server-side)
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

        return redirect()->back()->with('success', 'User deleted successfully.');
    }
}
