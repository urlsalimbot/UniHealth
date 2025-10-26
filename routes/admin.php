<?php

use App\Http\Controllers\Admin\AdminControlDashboard;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\ExistingUserController;
use App\Http\Controllers\Admin\UserCreateController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:administrator'])->name('admin.')->group(function () {

    Route::get('/users', [AdminControlDashboard::class, 'index'])
        ->name('dashboard');

    Route::get('/users/create', [UserCreateController::class, 'create'])
        ->name('users.create');

    Route::get('/users/{id}', [ExistingUserController::class, 'show'])
        ->name('users.show');

    Route::post('/users', [UserCreateController::class, 'store'])
        ->name('users.store');

    Route::delete('/users/{user}', [ExistingUserController::class, 'destroy'])
        ->name('users.destroy');

});

Route::middleware(['auth', 'role:administrator,doctor,staff'])->group(function () {

    Route::get('dashboard', [AdminDashboardController::class, 'index'])
        ->name('dashboard');

});

