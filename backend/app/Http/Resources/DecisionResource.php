<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DecisionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'decision' => $this->decision,
            'observation' => $this->observation,
            'montant_accorde' => $this->montant_accorde,
            'date_decision' => $this->date_decision,
            'commission_id' => $this->commission_id,
            'demande_id' => $this->demande_id,
            'montant_paye' => $this->when(
                $this->relationLoaded('paiements'),
                fn () => $this->montantPaye(),
            ),
            'reste_a_payer' => $this->when(
                $this->relationLoaded('paiements'),
                fn () => $this->resteAPayer(),
            ),
            'commission' => new CommissionResource($this->whenLoaded('commission')),
            'demande' => new DemandeBourseResource($this->whenLoaded('demande')),
            'created_at' => $this->created_at,
        ];
    }
}
