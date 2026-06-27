<?php

namespace App\Repositories;

use App\Models\TypeBourse;

class TypeBourseRepository extends BaseRepository
{
    protected array $searchable = ['nom'];

    public function __construct(TypeBourse $model)
    {
        parent::__construct($model);
    }
}
