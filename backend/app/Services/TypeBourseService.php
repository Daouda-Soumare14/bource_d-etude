<?php

namespace App\Services;

use App\Repositories\TypeBourseRepository;

class TypeBourseService extends BaseService
{
    public function __construct(TypeBourseRepository $repository)
    {
        $this->repository = $repository;
    }
}
