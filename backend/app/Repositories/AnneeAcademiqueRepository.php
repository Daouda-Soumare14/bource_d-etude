<?php

namespace App\Repositories;

use App\Models\AnneeAcademique;

class AnneeAcademiqueRepository extends BaseRepository
{
    protected array $searchable = ['libelle'];

    public function __construct(AnneeAcademique $model)
    {
        parent::__construct($model);
    }

    public function active(): ?AnneeAcademique
    {
        return $this->query()->where('active', true)->first();
    }
}
