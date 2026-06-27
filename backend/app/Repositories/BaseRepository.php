<?php

namespace App\Repositories;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Implémentation générique du Repository Pattern.
 * Les repositories concrets héritent de cette classe et fixent le modèle ciblé.
 */
abstract class BaseRepository implements RepositoryInterface
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function query(): Builder
    {
        return $this->model->newQuery();
    }

    public function all(array $relations = []): Collection
    {
        return $this->query()->with($relations)->latest('id')->get();
    }

    public function paginate(int $perPage = 15, array $relations = [], array $filters = []): LengthAwarePaginator
    {
        $query = $this->query()->with($relations);
        $query = $this->applyFilters($query, $filters);

        return $query->latest('id')->paginate($perPage)->withQueryString();
    }

    public function find(int $id, array $relations = []): ?Model
    {
        return $this->query()->with($relations)->find($id);
    }

    public function findOrFail(int $id, array $relations = []): Model
    {
        return $this->query()->with($relations)->findOrFail($id);
    }

    public function create(array $data): Model
    {
        return $this->model->newInstance()->create($data);
    }

    public function update(int $id, array $data): Model
    {
        $record = $this->findOrFail($id);
        $record->update($data);

        return $record->fresh();
    }

    public function delete(int $id): bool
    {
        return (bool) $this->findOrFail($id)->delete();
    }

    /**
     * Filtres appliqués automatiquement : recherche plein-texte (`search`)
     * sur les colonnes déclarées et égalité stricte sur les autres clés.
     * Les repositories concrets peuvent surcharger cette méthode.
     */
    protected function applyFilters(Builder $query, array $filters): Builder
    {
        foreach ($filters as $field => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            if ($field === 'search' && property_exists($this, 'searchable')) {
                $query->where(function (Builder $q) use ($value) {
                    foreach ($this->searchable as $column) {
                        $q->orWhere($column, 'ILIKE', "%{$value}%");
                    }
                });
                continue;
            }

            if (in_array($field, $this->model->getFillable(), true)) {
                $query->where($field, $value);
            }
        }

        return $query;
    }
}
