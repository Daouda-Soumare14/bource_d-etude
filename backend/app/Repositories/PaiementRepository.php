<?php

namespace App\Repositories;

use App\Models\Paiement;
use Illuminate\Database\Eloquent\Builder;

class PaiementRepository extends BaseRepository
{
    public function __construct(Paiement $model)
    {
        parent::__construct($model);
    }

    protected function applyFilters(Builder $query, array $filters): Builder
    {
        if (! empty($filters['statut'])) {
            $query->where('statut', $filters['statut']);
        }
        if (! empty($filters['decision_id'])) {
            $query->where('decision_id', $filters['decision_id']);
        }
        if (! empty($filters['reference'])) {
            $query->where('reference', 'ILIKE', "%{$filters['reference']}%");
        }

        return $query;
    }
}
