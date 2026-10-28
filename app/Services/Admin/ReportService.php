<?php

namespace App\Services\Admin;

use App\Models\User;
use App\Models\Species;
use App\Models\Observation;
use Illuminate\Support\Facades\DB;

class ReportService
{
    public function getGeneralStats()
    {
        return [
            'userStats' => [
                'total' => User::count(),
                'admin' => User::where('role_id', 1)->count(),
                'expert' => User::where('role_id', 2)->count(),
                'common_user' => User::where('role_id', 3)->count(),
            ],
            'speciesCount' => Species::count(),
            'observationStats' => [
                'total' => Observation::count(),
                'verified' => Observation::where('status', 'verified')->count(),
                'pending' => Observation::where('status', 'pending')->count(),
            ],
            'monthlyGrowth' => User::select(
                DB::raw('count(*) as total'), 
                DB::raw("DATE_FORMAT(created_at, '%M') as month")
            )
            ->groupBy('month')
            ->orderBy('created_at')
            ->get()
        ];
    }
}