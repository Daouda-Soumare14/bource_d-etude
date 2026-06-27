<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository extends BaseRepository
{
    protected array $searchable = ['nom', 'prenom', 'email', 'telephone'];

    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function parEmail(string $email): ?User
    {
        return $this->query()->where('email', $email)->first();
    }
}
