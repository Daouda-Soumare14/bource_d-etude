<?php

namespace App\Repositories;

use App\Models\DemandeBourse;
use Illuminate\Database\Eloquent\Builder;

class DemandeBourseRepository extends BaseRepository
{
    public function __construct(DemandeBourse $model)
    {
        parent::__construct($model);
    }

    protected function applyFilters(Builder $query, array $filters): Builder
    {
        if (! empty($filters['statut'])) {
            $query->where('statut', $filters['statut']);
        }
        if (! empty($filters['annee_id'])) {
            $query->where('annee_id', $filters['annee_id']);
        }
        if (! empty($filters['type_bourse_id'])) {
            $query->where('type_bourse_id', $filters['type_bourse_id']);
        }
        if (! empty($filters['etudiant_id'])) {
            $query->where('etudiant_id', $filters['etudiant_id']);
        }
        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->whereHas('etudiant', function (Builder $q) use ($search) {
                $q->where('matricule', 'ILIKE', "%{$search}%")
                    ->orWhereHas('utilisateur', fn (Builder $u) => $u
                        ->where('nom', 'ILIKE', "%{$search}%")
                        ->orWhere('prenom', 'ILIKE', "%{$search}%"));
            });
        }

        return $query;
    }
}
