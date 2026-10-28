<?php

namespace App\Http\Controllers;

use App\Models\Observation;
use App\Models\Species;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $role = $user->role_id;

        // 1. DASHBOARD ADMIN (Role 1)
        if ($role === 1) {
            // Hitung statistik user berdasarkan role_id
            $userStats = [
                'total' => User::count(),
                'admin' => User::where('role_id', 1)->count(),
                'expert' => User::where('role_id', 2)->count(),
                'common_user' => User::where('role_id', 3)->count(),
            ];

            // Hitung statistik observasi
            $observationStats = [
                'verified' => Observation::where('status', 'verified')->count(),
                'pending' => Observation::where('status', 'pending')->count(),
                'rejected' => Observation::where('status', 'rejected')->count(),
            ];

            // Ambil pertumbuhan user 6 bulan terakhir (Simple Query)
            $monthlyGrowth = collect(range(5, 0))->map(function ($i) {
                $date = now()->subMonths($i);
                return [
                    'month' => $date->format('M'),
                    'total' => User::whereMonth('created_at', $date->month)
                                   ->whereYear('created_at', $date->year)
                                   ->count()
                ];
            })->values();

            return Inertia::render('admin/dashboard', [
                'stats' => [
                    'total_users' => $userStats['total'],
                    'total_observations' => Observation::count(),
                    'total_species' => Species::count(),
                    'pending_verifications' => $observationStats['pending'],
                ],
                'userStats' => $userStats,
                'observationStats' => $observationStats,
                'monthlyGrowth' => $monthlyGrowth,
                'recent_users' => User::latest()->take(5)->get(),
            ]);
        }

        // 2. DASHBOARD EXPERT (Role 2) 
        // Note: Pastikan ini juga mengirim data statistik jika dashboard pakar kamu butuh!
        if ($role === 2) {
            return Inertia::render('expert/dashboard', [
                'tasks' => [
                    'pending_count' => Observation::where('status', 'pending')->count(),
                    'verified_count' => Observation::where('status', 'verified')->count(),
                ],
                'statistics' => [
                    'total' => Observation::count(),
                    'verified' => Observation::where('status', 'verified')->count(),
                    'rejected' => Observation::where('status', 'rejected')->count(),
                    'today' => Observation::whereDate('created_at', today())->count(),
                ],
                'distribution' => Species::withCount('observations')
                    ->get()
                    ->map(fn($s) => ['category' => $s->name, 'total' => $s->observations_count]),
                'recent_pending' => Observation::with(['user', 'photos'])
                    ->where('status', 'pending')
                    ->latest()
                    ->take(10)
                    ->get(),
            ]);
        }

        // 3. DASHBOARD USER
        if ($role === 3) {
            $myObservations = Observation::where('user_id', $user->id);

            $userStats = [
                'my_total_uploads' => (clone $myObservations)->count(),
                'my_verified' => (clone $myObservations)->where('status', 'verified')->count(),
                'my_rejected' => (clone $myObservations)->where('status', 'rejected')->count(),
                'my_pending' => (clone $myObservations)->where('status', 'pending')->count(),
            ];

            $monthlyUploads = collect(range(5, 0))->map(function ($i) use ($user) {
                $date = now()->subMonths($i);
                return [
                    'month' => $date->format('M'),
                    'total' => Observation::where('user_id', $user->id)
                        ->whereMonth('created_at', $date->month)
                        ->whereYear('created_at', $date->year)
                        ->count(),
                ];
            })->values();

            $categoryBreakdown = Observation::query()
                ->join('species', 'observations.species_id', '=', 'species.id')
                ->where('observations.user_id', $user->id)
                ->select('species.category', DB::raw('COUNT(*) as total'))
                ->groupBy('species.category')
                ->orderByDesc('total')
                ->get();

            return Inertia::render('user/dashboard', [
                'user_stats' => $userStats,
                'monthly_uploads' => $monthlyUploads,
                'category_breakdown' => $categoryBreakdown,
                'my_recent_uploads' => Observation::with('species')
                    ->where('user_id', $user->id)
                    ->latest()
                    ->take(5)
                    ->get(),
            ]);
        }

        abort(403, 'Role tidak dikenali.');
    }
}