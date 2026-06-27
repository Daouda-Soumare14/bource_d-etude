<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EtudiantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'matricule' => $this->matricule,
            'date_naissance' => $this->date_naissance,
            'sexe' => $this->sexe,
            'region' => $this->region,
            'niveau' => $this->niveau,
            'utilisateur_id' => $this->utilisateur_id,
            'utilisateur' => new UserResource($this->whenLoaded('utilisateur')),
            'universite' => new UniversiteResource($this->whenLoaded('universite')),
            'faculte' => new FaculteResource($this->whenLoaded('faculte')),
            'filiere' => new FiliereResource($this->whenLoaded('filiere')),
            'created_at' => $this->created_at,
        ];
    }
}
