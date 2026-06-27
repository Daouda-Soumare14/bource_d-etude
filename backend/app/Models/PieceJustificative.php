<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PieceJustificative extends Model
{
    use HasFactory;

    protected $table = 'pieces_justificatives';

    public const STATUT_ATTENTE = 'En attente';
    public const STATUT_VALIDEE = 'Validée';
    public const STATUT_REJETEE = 'Rejetée';

    protected $fillable = [
        'demande_id', 'nom_document', 'chemin', 'statut', 'motif_rejet',
    ];

    public function demande(): BelongsTo
    {
        return $this->belongsTo(DemandeBourse::class, 'demande_id');
    }
}
