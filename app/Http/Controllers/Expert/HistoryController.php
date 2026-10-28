<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use App\Services\Expert\HistoryService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HistoryController extends Controller
{
    public function index(HistoryService $historyService)
    {
        // Memanggil data riwayat dari HistoryService
        $verifications = $historyService->getExpertHistory(Auth::id());

        return Inertia::render('expert/riwayat/index', [
            'verifications' => $verifications,
        ]);
    }
}