<?php

namespace App\Repositories;

use App\Models\PieceJustificative;

class PieceJustificativeRepository extends BaseRepository
{
    public function __construct(PieceJustificative $model)
    {
        parent::__construct($model);
    }
}
