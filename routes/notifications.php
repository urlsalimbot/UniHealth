<?php

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{notification}/view', [NotificationController::class, 'markAsViewed']);
    Route::post('/notifications/view-all', [NotificationController::class, 'markAllAsViewed']); // ✅ new route
});

