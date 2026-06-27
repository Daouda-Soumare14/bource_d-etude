<?php

namespace App\Repositories;

use App\Models\Commission;

class CommissionRepository extends BaseRepository
{
    protected array $searchable = ['nom'];

    public function __construct(Commission $model)
    {
        parent::__construct($model);
    }
}
