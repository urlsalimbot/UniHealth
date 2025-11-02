<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;


class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        $notifications = Notification::query()
            ->where(function ($q) use ($user, $role) {
                $q->where('user_id', $user->id)
                    ->orWhere('role', $role)
                    ->orWhere('is_global', true);
            })
            ->latest()
            ->take(15)
            ->get();

        // Ensure pivot entries exist
        $user->notifications()->syncWithoutDetaching($notifications->pluck('id'));

        $result = $notifications->map(function ($n) use ($user) {
            $pivot = $user->notifications->firstWhere('id', $n->id)?->pivot;
            return [
                'id' => $n->id,
                'title' => $n->title,
                'message' => $n->message,
                'type' => $n->type,
                'action_url' => $n->action_url,
                'is_viewed' => (bool) $pivot?->is_viewed,
                'created_at' => $n->created_at->diffForHumans(),
            ];
        });

        $unreadCount = $user->notifications()->wherePivot('is_viewed', false)->count();

        return response()->json([
            'notifications' => $result,
            'unreadCount' => $unreadCount,
        ]);
    }

    public function markAsViewed(Notification $notification, Request $request)
    {
        $request->user()->notifications()
            ->updateExistingPivot($notification->id, ['is_viewed' => true]);
        return response()->json(['success' => true]);
    }

    public function markAllAsViewed(Request $request)
    {
        $user = $request->user();

        // Mark all notifications for the user as viewed in the pivot table
        $user->notifications()->updateExistingPivot(
            $user->notifications->pluck('id')->toArray(),
            ['is_viewed' => true]
        );

        return response()->json(['success' => true]);
    }
}
