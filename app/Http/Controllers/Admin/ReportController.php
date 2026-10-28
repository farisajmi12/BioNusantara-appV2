<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\ReportService;
use Inertia\Inertia;

class ReportController extends Controller
{
    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function index()
    {
        $stats = $this->reportService->getGeneralStats();

        return Inertia::render('admin/reports/index', [
            'userStats' => $stats['userStats'],
            'speciesCount' => $stats['speciesCount'],
            'observationStats' => $stats['observationStats'],
            'monthlyGrowth' => $stats['monthlyGrowth']
        ]);
    }
}