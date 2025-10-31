<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use OwenIt\Auditing\Models\Audit;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => [
                'message' => trim($message),
                'author' => trim($author),
            ],

            'auth' => [
                'user' => fn() => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'patient_id' => $request->user()->patient_id,
                    'avatar' => $request->user()->avatar,

                    // 👇 last 10 audits by this user
                    'notifications' => Audit::query()
                        ->where('user_id', $request->user()->id)
                        ->latest()
                        ->take(10)
                        ->get(['id', 'event', 'auditable_type', 'created_at'])
                        ->map(function ($audit) {
                            return [
                                'id' => $audit->id,
                                'action' => ucfirst($audit->event),
                                'entity' => class_basename($audit->auditable_type),
                                'created_at' => $audit->created_at->diffForHumans(),
                            ];
                        }),
                ] : null,
            ],

            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

}
