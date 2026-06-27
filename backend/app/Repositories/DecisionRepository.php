<?php

namespace App\Repositories;

use App\Models\Decision;

class DecisionRepository extends BaseRepository
{
    public function __construct(Decision $model)
    {
        parent::__construct($model);
    }
}
