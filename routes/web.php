<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/patients.php';
require __DIR__ . '/inventory.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/healthcare.php';
require __DIR__ . '/notifications.php';
