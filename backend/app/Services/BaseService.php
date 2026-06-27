<?php

namespace App\Services;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Couche service générique : orchestre la logique métier et délègue
 * la persistance au repository injecté. Les services concrets ajoutent
 * les règles métier spécifiques (workflow des demandes, paiements, etc.).
 */
abstract class BaseService
{
    protected RepositoryInterface $repository;

    protected array $relations = [];

    public function liste(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage, $this->relations, $filters);
    }

    public function tout(): Collection
    {
        return $this->repository->all($this->relations);
    }

    public function trouver(int $id): Model
    {
        return $this->repository->findOrFail($id, $this->relations);
    }

    public function creer(array $data): Model
    {
        return $this->repository->create($data);
    }

    public function modifier(int $id, array $data): Model
    {
        return $this->repository->update($id, $data);
    }

    public function supprimer(int $id): bool
    {
        return $this->repository->delete($id);
    }
}
