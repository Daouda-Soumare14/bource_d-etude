<?php

namespace App\Repositories;

use App\Models\Universite;

class UniversiteRepository extends BaseRepository
{
    protected array $searchable = ['nom', 'sigle', 'region'];

    public function __construct(Universite $model)
    {
        parent::__construct($model);
    }
}
