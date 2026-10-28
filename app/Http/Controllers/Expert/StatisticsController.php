<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use App\Models\Verification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StatisticsController extends Controller
{
    public function index()
    {
        $expertId = Auth::id();

        // Statistik Dasar
        $stats = [
            'total' => Verification::where('expert_id', $expertId)->count(),
            'verified' => Verification::where('expert_id', $expertId)->where('is_valid', true)->count(),
            'rejected' => Verification::where('expert_id', $expertId)->where('is_valid', false)->count(),
            'today' => Verification::where('expert_id', $expertId)->whereDate('created_at', today())->count(),
        ];

        // Distribusi Kategori (Misal: Plankton vs Hoya)
        $distribution = Verification::join('observations', 'verifications.observation_id', '=', 'observations.id')
            ->join('species', 'observations.species_id', '=', 'species.id')
            ->where('verifications.expert_id', $expertId)
            ->select('species.category', DB::raw('count(*) as total'))
            ->groupBy('species.category')
            ->get();

        // Data Bulanan (Sederhana untuk tren)
        $monthlyTrend = Verification::where('expert_id', $expertId)
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('count(*) as total'))
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return Inertia::render('expert/statistik/index', [
            'statistics' => $stats,
            'distribution' => $distribution,
            'monthlyTrend' => $monthlyTrend,
        ]);
    }
}
