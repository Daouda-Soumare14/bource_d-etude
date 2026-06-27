<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $table = 'notifications';

    public const TYPE_DEMANDE_ACCEPTEE = 'demande_acceptee';
    public const TYPE_DEMANDE_REFUSEE = 'demande_refusee';
    public const TYPE_PAIEMENT = 'paiement';
    public const TYPE_RECLAMATION = 'reclamation';
    public const TYPE_INFO = 'info';

    protected $fillable = [
        'utilisateur_id', 'titre', 'contenu', 'type', 'lu',
    ];

    protected $casts = [
        'lu' => 'boolean',
    ];

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
}
