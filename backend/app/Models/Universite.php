<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Universite extends Model
{
    use HasFactory;

    protected $table = 'universites';

    protected $fillable = [
        'nom', 'sigle', 'type', 'adresse', 'telephone', 'email', 'region',
    ];

    public function facultes(): HasMany
    {
        return $this->hasMany(Faculte::class);
    }

    public function etudiants(): HasMany
    {
        return $this->hasMany(Etudiant::class);
    }
}
