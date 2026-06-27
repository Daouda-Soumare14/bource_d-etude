<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Contrat générique du Repository Pattern.
 * Toutes les opérations d'accès aux données passent par cette abstraction,
 * ce qui découple la couche métier (Services) de l'ORM Eloquent.
 */
interface RepositoryInterface
{
    public function all(array $relations = []): Collection;

    public function paginate(int $perPage = 15, array $relations = [], array $filters = []): LengthAwarePaginator;

    public function find(int $id, array $relations = []): ?Model;

    public function findOrFail(int $id, array $relations = []): Model;

    public function create(array $data): Model;

    public function update(int $id, array $data): Model;

    public function delete(int $id): bool;
}
