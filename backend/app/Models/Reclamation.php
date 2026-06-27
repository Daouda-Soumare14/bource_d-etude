<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reclamation extends Model
{
    use HasFactory;

    protected $table = 'reclamations';

    public const STATUT_OUVERTE = 'Ouverte';
    public const STATUT_EN_COURS = 'En cours';
    public const STATUT_TRAITEE = 'Traitée';
    public const STATUT_FERMEE = 'Fermée';

    protected $fillable = [
        'etudiant_id', 'demande_id', 'objet', 'description',
        'document', 'statut', 'reponse',
    ];

    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(Etudiant::class);
    }

    public function demande(): BelongsTo
    {
        return $this->belongsTo(DemandeBourse::class, 'demande_id');
    }
}
