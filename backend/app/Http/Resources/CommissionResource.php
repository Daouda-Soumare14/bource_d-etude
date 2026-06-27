<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'date_reunion' => $this->date_reunion,
            'description' => $this->description,
            'membres' => UserResource::collection($this->whenLoaded('membres')),
            'decisions_count' => $this->whenCounted('decisions'),
            'created_at' => $this->created_at,
        ];
    }
}
