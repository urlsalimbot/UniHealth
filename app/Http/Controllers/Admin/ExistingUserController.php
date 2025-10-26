<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Audit;
use App\Notifications\AuditEventNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;



class ExistingUserController extends Controller
{
    public function show($id)
    {
        $user = User::findOrFail($id);

        return Inertia::render('admin/show', [
            'user' => $user,
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

        return redirect()
            ->route('admin.dashboard')
            ->with('success', 'User deleted and audit logged.');
    }
}
