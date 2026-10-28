<?php

namespace App\Services\Admin;

use App\Models\Species;

class SpeciesService
{
    /**
     * Mengambil data spesies (opsional filter search + category).
     */
    public function getAllSpecies($search = null, $category = null)
    {
        return Species::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('scientific_name', 'like', "%{$search}%")
                        ->orWhere('common_name', 'like', "%{$search}%");
                });
            })
            ->when($category, function ($query, $category) {
                $query->where('category', $category);
            })
            ->latest()
            ->get();
    }

    /**
     * Logika untuk menyimpan spesies baru.
     */
    public function createSpecies(array $data)
    {
        return Species::create($data);
    }

    /**
     * Logika untuk menghapus spesies.
     */
    public function deleteSpecies(int $id)
    {
        $species = Species::findOrFail($id);

        return $species->delete();
    }
}