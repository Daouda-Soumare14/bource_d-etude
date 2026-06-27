<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaiementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'decision_id' => $this->decision_id,
            'montant' => $this->montant,
            'date_paiement' => $this->date_paiement,
            'mode_paiement' => $this->mode_paiement,
            'reference' => $this->reference,
            'statut' => $this->statut,
            'decision' => new DecisionResource($this->whenLoaded('decision')),
            'created_at' => $this->created_at,
        ];
    }
}
