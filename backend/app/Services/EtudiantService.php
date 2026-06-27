<?php

namespace App\Services;

use App\Models\Etudiant;
use App\Repositories\EtudiantRepository;

class EtudiantService extends BaseService
{
    protected array $relations = ['utilisateur', 'universite', 'faculte', 'filiere'];

    public function __construct(EtudiantRepository $repository)
    {
        $this->repository = $repository;
    }

    public function parUtilisateur(int $userId): ?Etudiant
    {
        return $this->repository->parUtilisateur($userId);
    }
}
