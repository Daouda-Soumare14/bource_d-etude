<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Paiement extends Model
{
    use HasFactory;

    protected $table = 'paiements';

    public const STATUT_PAYE = 'payé';
    public const STATUT_ATTENTE = 'en attente';
    public const STATUT_ANNULE = 'annulé';

    protected $fillable = [
        'decision_id', 'montant', 'date_paiement',
        'mode_paiement', 'reference', 'statut',
    ];

    protected $casts = [
        'date_paiement' => 'date',
        'montant' => 'decimal:2',
    ];

    public function decision(): BelongsTo
    {
        return $this->belongsTo(Decision::class);
    }
}
