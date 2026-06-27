<?php

namespace App\Services;

use App\Models\Commission;
use App\Repositories\CommissionRepository;

class CommissionService extends BaseService
{
    protected array $relations = ['membres', 'decisions'];

    public function __construct(CommissionRepository $repository)
    {
        $this->repository = $repository;
    }

    /** Affecte (synchronise) les membres d'une commission. */
    public function affecterMembres(int $commissionId, array $membres): Commission
    {
        /** @var Commission $commission */
        $commission = $this->repository->findOrFail($commissionId);

        // $membres : [ ['utilisateur_id' => 1, 'role_membre' => 'président'], ... ]
        $sync = [];
        foreach ($membres as $membre) {
            $sync[$membre['utilisateur_id']] = ['role_membre' => $membre['role_membre'] ?? 'membre'];
        }
        $commission->membres()->sync($sync);

        return $commission->load('membres');
    }
}
