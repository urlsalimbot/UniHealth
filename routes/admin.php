<?php

use App\Http\Controllers\Admin\AdminControlDashboard;
use App\Http\Controllers\Admin\AdminDashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:administrator'])->group(function () {

    Route::get('/users', [AdminControlDashboard::class, 'index'])
        ->name('admin.dashboard');

    Route::delete('/users/{user}', [AdminControlDashboard::class, 'destroy'])
        ->name('admin.users.destroy');
});

Route::middleware(['auth', 'role:administrator,staff'])->group(function () {

    Route::get('dashboard', [AdminDashboardController::class, 'index'])
        ->name('dashboard');

});

