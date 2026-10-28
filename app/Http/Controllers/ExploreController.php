<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Species;
use App\Models\Observation;

class ExploreController extends Controller
{
    // Method untuk halaman /jelajah
    public function index()
    {
        $speciesData = Species::withCount('observations')->get()->map(function($item) {
            return [
                'id' => $item->id,
                'commonName' => $item->common_name,
                'scientificName' => $item->scientific_name,
                'category' => ucfirst($item->category),
                'photoUrl' => $item->photo_url ?? '/placeholder.svg',
                'observationCount' => $item->observations_count,
            ];
        });

        // PERBAIKAN: Tambahkan 'photos' di dalam with()
        $observationsData = Observation::with(['species', 'user', 'photos'])
            ->where('status', 'verified')
            ->get()
            ->map(function($obs) {
                return [
                    'id' => $obs->id,
                    'speciesName' => $obs->species->common_name ?? 'Tidak diketahui',
                    'scientificName' => $obs->species->scientific_name ?? 'Tidak diketahui',
                    'latitude' => $obs->latitude,
                    'longitude' => $obs->longitude,
                    // PERBAIKAN: Kirim seluruh relasi photos agar React bisa memproses file_path-nya
                    'photos' => $obs->photos, 
                    'date' => $obs->created_at->format('Y-m-d'),
                    'observer' => $obs->user->name ?? 'Anonim',
                ];
            });

        return Inertia::render('Jelajah', [
            'species' => $speciesData,
            'observations' => $observationsData
        ]);
    }

    // Method untuk halaman /detailSpesies/{id}
    public function show($id)
    {
        // PERBAIKAN: Tambahkan 'photos' di dalam with()
        $obs = Observation::with(['species', 'user', 'photos'])->findOrFail($id);

        $observationData = [
            'id' => $obs->id,
            'speciesName' => $obs->species->common_name ?? 'Tidak diketahui',
            'scientificName' => $obs->species->scientific_name ?? 'Tidak diketahui',
            'category' => ucfirst($obs->species->category ?? 'Lainnya'),
            'latitude' => $obs->latitude,
            'longitude' => $obs->longitude,
            // PERBAIKAN: Kirim seluruh relasi photos
            'photos' => $obs->photos, 
            'date' => $obs->created_at->format('d F Y'),
            'observer' => $obs->user->name ?? 'Anonim',
        ];

        return Inertia::render('detailSpesies', [
            'observation' => $observationData
        ]);
    }
}