<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ReclamationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'objet' => $this->objet,
            'description' => $this->description,
            'document' => $this->document,
            'document_url' => $this->document ? Storage::disk('public')->url($this->document) : null,
            'statut' => $this->statut,
            'reponse' => $this->reponse,
            'etudiant_id' => $this->etudiant_id,
            'demande_id' => $this->demande_id,
            'etudiant' => new EtudiantResource($this->whenLoaded('etudiant')),
            'demande' => new DemandeBourseResource($this->whenLoaded('demande')),
            'created_at' => $this->created_at,
        ];
    }
}
