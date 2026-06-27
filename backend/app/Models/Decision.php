<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Decision extends Model
{
    use HasFactory;

    protected $table = 'decisions';

    public const ACCEPTEE = 'Acceptée';
    public const REFUSEE = 'Refusée';

    protected $fillable = [
        'commission_id', 'demande_id', 'decision',
        'observation', 'montant_accorde', 'date_decision',
    ];

    protected $casts = [
        'date_decision' => 'date',
        'montant_accorde' => 'decimal:2',
    ];

    public function commission(): BelongsTo
    {
        return $this->belongsTo(Commission::class);
    }

    public function demande(): BelongsTo
    {
        return $this->belongsTo(DemandeBourse::class, 'demande_id');
    }

    public function paiements(): HasMany
    {
        return $this->hasMany(Paiement::class);
    }

    /** Montant déjà payé (paiements au statut "payé"). */
    public function montantPaye(): float
    {
        return (float) $this->paiements()->where('statut', Paiement::STATUT_PAYE)->sum('montant');
    }

    /** Reste à payer sur le montant accordé. */
    public function resteAPayer(): float
    {
        return max(0, (float) $this->montant_accorde - $this->montantPaye());
    }
}
