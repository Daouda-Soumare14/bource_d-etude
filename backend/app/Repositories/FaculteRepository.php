<?php

namespace App\Repositories;

use App\Models\Faculte;

class FaculteRepository extends BaseRepository
{
    protected array $searchable = ['nom'];

    public function __construct(Faculte $model)
    {
        parent::__construct($model);
    }
}
