<?php

namespace App\Services;

use App\Repositories\FaculteRepository;

class FaculteService extends BaseService
{
    protected array $relations = ['universite', 'filieres'];

    public function __construct(FaculteRepository $repository)
    {
        $this->repository = $repository;
    }
}
