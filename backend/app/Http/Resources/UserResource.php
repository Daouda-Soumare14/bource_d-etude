<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'nom_complet' => $this->nom_complet,
            'email' => $this->email,
            'telephone' => $this->telephone,
            'photo' => $this->photo,
            'adresse' => $this->adresse,
            'actif' => $this->actif,
            'email_verifie' => $this->email_verified_at !== null,
            'roles' => $this->whenLoaded('roles', fn () => $this->roles->pluck('name')),
            'permissions' => $this->when(
                $request->user()?->id === $this->id,
                fn () => $this->getAllPermissions()->pluck('name'),
            ),
            'etudiant' => new EtudiantResource($this->whenLoaded('etudiant')),
            'created_at' => $this->created_at,
        ];
    }
}
