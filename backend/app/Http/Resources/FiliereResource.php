<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FiliereResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'faculte_id' => $this->faculte_id,
            'faculte' => new FaculteResource($this->whenLoaded('faculte')),
            'created_at' => $this->created_at,
        ];
    }
}
