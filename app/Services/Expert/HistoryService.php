<?php

namespace App\Services\Expert;

use App\Models\Verification;

class HistoryService
{
    /**
     * Mengambil riwayat verifikasi berdasarkan ID Pakar (Expert)
     */
    public function getExpertHistory(int $expertId)
    {
        return Verification::with([
            'observation.species',
            'observation.user',
            'observation.photos', // Relasi foto agar gambar muncul
        ])
        ->where('expert_id', $expertId)
        ->latest() // Urutkan dari yang terbaru
        ->get();
    }
}