<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DemandeBourse extends Model
{
    use HasFactory;

    protected $table = 'demandes_bourses';

    // Statuts possibles d'une demande de bourse.
    public const STATUT_BROUILLON = 'Brouillon';
    public const STATUT_SOUMISE = 'Soumise';
    public const STATUT_VERIFICATION = 'En vérification';
    public const STATUT_ACCEPTEE = 'Acceptée';
    public const STATUT_REFUSEE = 'Refusée';
    public const STATUT_PAYEE = 'Payée';

    public const STATUTS = [
        self::STATUT_BROUILLON,
        self::STATUT_SOUMISE,
        self::STATUT_VERIFICATION,
        self::STATUT_ACCEPTEE,
        self::STATUT_REFUSEE,
        self::STATUT_PAYEE,
    ];

    protected $fillable = [
        'etudiant_id', 'annee_id', 'type_bourse_id',
        'date_demande', 'montant_demande', 'statut', 'observation',
    ];

    protected $casts = [
        'date_demande' => 'date',
        'montant_demande' => 'decimal:2',
    ];

    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(Etudiant::class);
    }

    public function annee(): BelongsTo
    {
        return $this->belongsTo(AnneeAcademique::class, 'annee_id');
    }

    public function typeBourse(): BelongsTo
    {
        return $this->belongsTo(TypeBourse::class, 'type_bourse_id');
    }

    public function pieces(): HasMany
    {
        return $this->hasMany(PieceJustificative::class, 'demande_id');
    }

    public function decision(): HasOne
    {
        return $this->hasOne(Decision::class, 'demande_id');
    }
}
