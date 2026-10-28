<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ObservationPhoto extends Model
{
    use HasFactory;

    /**
     * Kolom yang dapat diisi secara massal.
     * Berdasarkan tabel di database kamu.
     */
    protected $fillable = [
        'observation_id',
        'file_path',
        'is_primary', // Untuk menandai foto utama jika ada banyak foto
    ];

    /**
     * Relasi ke Observation: Satu foto dimiliki oleh satu observasi.
     */
    public function observation(): BelongsTo
    {
        return $this->belongsTo(Observation::class);
    }
}
