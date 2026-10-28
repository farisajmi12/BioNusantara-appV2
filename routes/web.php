<?php

use App\Http\Controllers\Admin\SpeciesController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VerificationController as AdminVerification;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Expert\VerificationController as ExpertVerification;
use App\Http\Controllers\Expert\ValidationController;
use App\Http\Controllers\User\ObservationController;
use App\Http\Controllers\Expert\HistoryController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\ExploreController;
use App\Http\Controllers\User\ExpertApplicationController;


use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

Route::get('/ajukan-pakar', [ExpertApplicationController::class, 'create'])->name('expert-application.create');
Route::post('/ajukan-pakar', [ExpertApplicationController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('expert-application.store');

// TARUH DI SINI: Route untuk Login with Google
Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle'])->name('google.login');
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);


Route::get('/', [WelcomeController::class, 'index'])->name('home');

Route::get('/jelajah', [ExploreController::class, 'index'])->name('explore');
Route::get('/detailSpesies/{id}', [ExploreController::class, 'show'])->name('species.detail');

Route::redirect('/peta', '/jelajah?tab=peta');


/*
|--------------------------------------------------------------------------
| PRIVATE ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin Routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::patch('/users/{user}/toggle', [UserController::class, 'toggleStatus'])->name('users.toggle');
        Route::put('/users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::patch('/users/{user}/role', [UserController::class, 'updateRole'])->name('users.role');
        Route::get('/spesies', [SpeciesController::class, 'index'])->name('species.index');
        Route::get('/verifikasi-ahli', [AdminVerification::class, 'index'])->name('verification.index');
        Route::patch('/verifikasi-ahli/{application}', [AdminVerification::class, 'verify'])->name('verification.verify');
        Route::get('/verifikasi-ahli/{application}/kredensial', [AdminVerification::class, 'downloadCredential'])->name('verification.credential');

        // Catatan: Saya merapikan route /laporan yang ganda dari kodemu sebelumnya
        Route::get('/laporan', [ReportController::class, 'index'])->name('reports');
    });

    // Expert Routes
    Route::middleware(['role:expert'])->prefix('expert')->name('expert.')->group(function () {

        Route::get('/verifikasi', [ExpertVerification::class, 'index'])->name('verification.index');
        Route::post('/verifikasi', [ExpertVerification::class, 'store'])->name('verification.store');
        Route::get('/riwayat', [HistoryController::class, 'index'])->name('history.index');
        Route::get('/validasi', [ValidationController::class, 'index'])->name('validation.index');

        Route::get('/statistik', function () {
            return inertia('expert/statistics/index');
        })->name('statistics.index');
    });

    // User Routes
    Route::middleware(['role:user'])->prefix('user')->group(function () {

        Route::get('/kontribusi', [ObservationController::class, 'contributions'])->name('user.contributions');
        Route::get('/observasi/riwayat', [ObservationController::class, 'history'])->name('observations.history');
        Route::get('/observasi/buat', [ObservationController::class, 'create'])->name('observations.create');

        Route::post('/observasi', [ObservationController::class, 'store'])->name('observations.store');

        Route::get('/observasi', [ObservationController::class, 'index'])->name('observations.index');
        Route::get('/observasi/{observation}', [ObservationController::class, 'show'])->name('observations.show');
        Route::get('/observasi/{observation}/edit', [ObservationController::class, 'edit'])->name('observations.edit');
        Route::put('/observasi/{observation}', [ObservationController::class, 'update'])->name('observations.update');
        Route::delete('/observasi/{observation}', [ObservationController::class, 'destroy'])->name('observations.destroy');
    });
});

require __DIR__ . '/settings.php';
