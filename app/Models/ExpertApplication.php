<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpertApplication extends Model
{
    protected $fillable = [
        'user_id', 'full_name', 'email', 'institution',
        'credential_path', 'bio', 'status', 'rejection_reason', 'reviewed_at',
    ];

    protected $casts = ['reviewed_at' => 'datetime'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}