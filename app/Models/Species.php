<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Species extends Model
{
    use HasFactory;

    /**
     * Nama tabel di database.
     */
    protected $table = 'species';

    /**
     * Kolom yang dapat diisi secara massal.
     * Disesuaikan dengan validasi di SpeciesController.
     */
    protected $fillable = [
        'scientific_name',
        'common_name',
        'category', // Contoh: Plankton, Hoya, Wood
        'description',
    ];

    /**
     * Relasi ke Observation: Satu spesies bisa muncul di banyak observasi user.
     */
    public function observations(): HasMany
    {
        return $this->hasMany(Observation::class);
    }
}
