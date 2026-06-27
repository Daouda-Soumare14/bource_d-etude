<?php

namespace App\Services;

use App\Models\AnneeAcademique;
use App\Repositories\AnneeAcademiqueRepository;
use Illuminate\Support\Facades\DB;

class AnneeAcademiqueService extends BaseService
{
    public function __construct(AnneeAcademiqueRepository $repository)
    {
        $this->repository = $repository;
    }

    public function active(): ?AnneeAcademique
    {
        return $this->repository->active();
    }

    /** Active une année et désactive toutes les autres (une seule année active). */
    public function activer(int $id): AnneeAcademique
    {
        return DB::transaction(function () use ($id) {
            $this->repository->query()->update(['active' => false]);

            return $this->repository->update($id, ['active' => true]);
        });
    }
}
