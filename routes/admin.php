<?php

use App\Http\Controllers\Admin\AdminControlDashboard;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:administrator'])->group(function () {

    Route::get('/users', [AdminControlDashboard::class, 'index'])
        ->name('admin.dashboard');

    Route::delete('/users/{user}', [AdminControlDashboard::class, 'destroy'])
        ->name('admin.users.destroy');

});