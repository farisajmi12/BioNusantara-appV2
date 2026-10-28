<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Observation extends Model
{
    use HasFactory;

    /**
     * Kolom yang dapat diisi secara massal (Mass Assignment).
     * Disesuaikan dengan struktur tabel di image_03418a.png
     */
    protected $fillable = [
        'user_id',
        'species_id',
        'category',        
        'species_name_ai',
        'latitude',
        'longitude',
        'ai_confidence',
        'status',
        'notes', 
        'observation_date',
    ];

    /**
     * Relasi ke User: Satu observasi dimiliki oleh satu pengguna.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Species: Satu observasi merujuk ke satu spesies (Plankton/Hoya).
     */
    public function species(): BelongsTo
    {
        return $this->belongsTo(Species::class);
    }

    /**
     * Relasi ke ObservationPhoto: Satu observasi bisa memiliki banyak foto.
     */
    public function photos(): HasMany
    {
        return $this->hasMany(ObservationPhoto::class);
    }

    /**
     * Relasi ke Verification: Satu observasi memiliki satu hasil verifikasi dari pakar.
     */
    public function verification(): HasOne
    {
        return $this->hasOne(Verification::class);
    }
}
