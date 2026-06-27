<?php

namespace App\Services;

use App\Repositories\UniversiteRepository;

class UniversiteService extends BaseService
{
    protected array $relations = ['facultes'];

    public function __construct(UniversiteRepository $repository)
    {
        $this->repository = $repository;
    }
}
