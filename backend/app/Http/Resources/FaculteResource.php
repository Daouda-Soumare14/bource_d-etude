<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FaculteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'universite_id' => $this->universite_id,
            'universite' => new UniversiteResource($this->whenLoaded('universite')),
            'filieres' => FiliereResource::collection($this->whenLoaded('filieres')),
            'created_at' => $this->created_at,
        ];
    }
}
