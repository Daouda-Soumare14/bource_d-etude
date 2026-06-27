<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Filiere extends Model
{
    use HasFactory;

    protected $table = 'filieres';

    protected $fillable = ['faculte_id', 'nom'];

    public function faculte(): BelongsTo
    {
        return $this->belongsTo(Faculte::class);
    }

    public function etudiants(): HasMany
    {
        return $this->hasMany(Etudiant::class);
    }
}
