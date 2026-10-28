<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    /**
     * Kolom yang boleh diisi secara massal.
     * id: 1 (admin), 2 (expert), 3 (user)
     */
    protected $fillable = [
        'id',
        'name',
        'display_name',
    ];

    /**
     * Relasi ke model User.
     * Satu Role bisa dimiliki oleh banyak User.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
