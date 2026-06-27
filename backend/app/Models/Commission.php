<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Commission extends Model
{
    use HasFactory;

    protected $table = 'commissions';

    protected $fillable = ['nom', 'date_reunion', 'description'];

    protected $casts = [
        'date_reunion' => 'date',
    ];

    public function membres(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'commission_membre', 'commission_id', 'utilisateur_id')
            ->withPivot('role_membre')
            ->withTimestamps();
    }

    public function decisions(): HasMany
    {
        return $this->hasMany(Decision::class);
    }
}
