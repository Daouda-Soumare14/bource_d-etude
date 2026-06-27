<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DemandeBourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date_demande' => $this->date_demande,
            'montant_demande' => $this->montant_demande,
            'statut' => $this->statut,
            'observation' => $this->observation,
            'etudiant_id' => $this->etudiant_id,
            'annee_id' => $this->annee_id,
            'type_bourse_id' => $this->type_bourse_id,
            'etudiant' => new EtudiantResource($this->whenLoaded('etudiant')),
            'annee' => new AnneeAcademiqueResource($this->whenLoaded('annee')),
            'type_bourse' => new TypeBourseResource($this->whenLoaded('typeBourse')),
            'pieces' => PieceJustificativeResource::collection($this->whenLoaded('pieces')),
            'decision' => new DecisionResource($this->whenLoaded('decision')),
            'created_at' => $this->created_at,
        ];
    }
}
