<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use App\Models\Observation;
use App\Models\Species;
use App\Services\Expert\VerificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VerificationController extends Controller
{
    public function index()
    {
        return Inertia::render('expert/verifikasi/index', [
            'pendingObservations' => Observation::with(['user', 'photos', 'species'])
                ->where('status', 'pending')
                ->latest()
                ->get(),
            'speciesList' => Species::select('id', 'scientific_name', 'category')->get(),
        ]);
    }

    public function store(Request $request, VerificationService $verificationService)
    {
        $validated = $request->validate([
            'observation_id' => 'required|exists:observations,id',
            'is_valid' => 'required', 
            'species_id' => 'nullable|exists:species,id',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            $isValidBoolean = filter_var($validated['is_valid'], FILTER_VALIDATE_BOOLEAN);

            $data = [
                'observation_id' => $validated['observation_id'],
                'is_valid' => $isValidBoolean,
                'species_id' => $validated['species_id'] ?? null, 
                'notes' => $validated['notes'] ?? null,
            ];

            $verificationService->processVerification($data, Auth::id());

            if ($isValidBoolean) {
                // JIKA SETUJU: Paksa pindah halaman ke riwayat via Inertia Location
                return Inertia::location(route('expert.history.index'));
            } else {
                // JIKA TOLAK: Tetap di halaman ini
                return redirect()->back();
            }

        } catch (\Exception $e) {
            // Tampilkan error jika ada yang salah di database
            dd($e->getMessage()); 
        }
    }
}