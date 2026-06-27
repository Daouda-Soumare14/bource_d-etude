<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PieceJustificativeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'demande_id' => $this->demande_id,
            'nom_document' => $this->nom_document,
            'chemin' => $this->chemin,
            'url' => $this->chemin ? Storage::disk('public')->url($this->chemin) : null,
            'statut' => $this->statut,
            'motif_rejet' => $this->motif_rejet,
            'created_at' => $this->created_at,
        ];
    }
}
