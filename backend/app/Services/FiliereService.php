<?php

namespace App\Services;

use App\Repositories\FiliereRepository;

class FiliereService extends BaseService
{
    protected array $relations = ['faculte.universite'];

    public function __construct(FiliereRepository $repository)
    {
        $this->repository = $repository;
    }
}
