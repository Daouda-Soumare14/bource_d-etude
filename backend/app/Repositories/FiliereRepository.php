<?php

namespace App\Repositories;

use App\Models\Filiere;

class FiliereRepository extends BaseRepository
{
    protected array $searchable = ['nom'];

    public function __construct(Filiere $model)
    {
        parent::__construct($model);
    }
}
