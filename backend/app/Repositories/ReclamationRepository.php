<?php

namespace App\Repositories;

use App\Models\Reclamation;

class ReclamationRepository extends BaseRepository
{
    protected array $searchable = ['objet', 'statut'];

    public function __construct(Reclamation $model)
    {
        parent::__construct($model);
    }
}
