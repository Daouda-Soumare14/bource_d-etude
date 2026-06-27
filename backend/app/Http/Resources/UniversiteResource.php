<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UniversiteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'sigle' => $this->sigle,
            'type' => $this->type,
            'adresse' => $this->adresse,
            'telephone' => $this->telephone,
            'email' => $this->email,
            'region' => $this->region,
            'facultes' => FaculteResource::collection($this->whenLoaded('facultes')),
            'facultes_count' => $this->whenCounted('facultes'),
            'created_at' => $this->created_at,
        ];
    }
}
