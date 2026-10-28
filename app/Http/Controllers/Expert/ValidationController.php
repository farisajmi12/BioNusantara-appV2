<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use App\Models\Species;
use Inertia\Inertia;

class ValidationController extends Controller
{
    public function index()
    {
        return Inertia::render('expert/validasi/index', [
            'species_references' => Species::orderBy('category')
                ->orderBy('scientific_name')
                ->get(),
        ]);
    }
}