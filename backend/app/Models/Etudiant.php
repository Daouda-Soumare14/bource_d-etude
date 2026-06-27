<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Etudiant extends Model
{
    use HasFactory;

    protected $table = 'etudiants';

    protected $fillable = [
        'utilisateur_id', 'matricule', 'date_naissance', 'sexe', 'region',
        'universite_id', 'faculte_id', 'filiere_id', 'niveau',
    ];

    protected $casts = [
        'date_naissance' => 'date',
    ];

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function universite(): BelongsTo
    {
        return $this->belongsTo(Universite::class);
    }

    public function faculte(): BelongsTo
    {
        return $this->belongsTo(Faculte::class);
    }

    public function filiere(): BelongsTo
    {
        return $this->belongsTo(Filiere::class);
    }

    public function demandes(): HasMany
    {
        return $this->hasMany(DemandeBourse::class);
    }

    public function reclamations(): HasMany
    {
        return $this->hasMany(Reclamation::class);
    }
}
