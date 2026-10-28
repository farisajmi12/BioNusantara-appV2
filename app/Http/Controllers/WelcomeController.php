<?php

namespace App\Http\Controllers;

use App\Models\Observation;
use App\Models\Species;
use App\Models\User;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class WelcomeController extends Controller
{
    public function index()
    {
        // 16 satwa acak yang punya foto, diambil dari tabel species (hasil SpeciesSeeder).
        // Frontend memakai 6 pertama untuk kartu galeri dan semuanya untuk pita berjalan.
        $species = Species::query()
            ->whereNotNull('photo_url')
            ->where('photo_url', '!=', '')
            ->inRandomOrder()
            ->limit(16)
            ->get(['id', 'common_name', 'scientific_name', 'category', 'photo_url'])
            ->map(fn ($item) => [
                'id'         => $item->id,
                'name'       => $item->common_name,
                'scientific' => $item->scientific_name,
                'category'   => $item->category,
                // Path seperti "/images/reptil/komodo.jpg" dipakai apa adanya.
                // Path tanpa awalan "/" atau "http" diberi "/" di depan.
                'photo'      => Str::startsWith($item->photo_url, ['http://', 'https://', '/'])
                    ? $item->photo_url
                    : '/' . ltrim($item->photo_url, '/'),
            ])
            ->values();

        // PERHATIKAN HURUF KECIL 'welcome' di bawah ini:
        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'stats' => [
                'totalObservations'  => Observation::count(),
                'totalSpecies'       => Species::count(),
                'activeContributors' => User::where('is_active', true)
                    ->whereHas('role', fn ($query) => $query->where('name', 'user'))
                    ->count(),
            ],
            'species' => $species,
        ]);
    }
}