<?php

namespace App\Repositories;

use App\Models\Etudiant;

class EtudiantRepository extends BaseRepository
{
    protected array $searchable = ['matricule', 'region', 'niveau'];

    public function __construct(Etudiant $model)
    {
        parent::__construct($model);
    }

    public function parUtilisateur(int $userId): ?Etudiant
    {
        return $this->query()->where('utilisateur_id', $userId)->first();
    }
}
