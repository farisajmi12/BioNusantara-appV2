<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\SpeciesService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SpeciesController extends Controller
{
    protected SpeciesService $speciesService;

    public function __construct(SpeciesService $service)
    {
        $this->speciesService = $service;
    }

    public function index(Request $request)
    {
        return Inertia::render('admin/spesies/index', [
            // Kirim parameter filter ke Service agar backend melakukan pencarian
            'species' => $this->speciesService->getAllSpecies($request->search, $request->category),

            // Kembalikan filter ke view React (Sangat penting agar layar tidak hitam)
            'filters' => $request->only(['search', 'category'])
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'scientific_name' => 'required|unique:species',
            'common_name' => 'nullable',
            'category' => 'required',
            'description' => 'nullable'
        ]);
        $this->speciesService->createSpecies($data);
        return redirect()->back()->with('success', 'Spesies berhasil ditambah.');
    }

    public function destroy(int $id)
    {
        {
            $this->speciesService->deleteSpecies($id);
            return redirect()->back()->with('success', 'Spesies berhasil dihapus.');
        }
    }
}
