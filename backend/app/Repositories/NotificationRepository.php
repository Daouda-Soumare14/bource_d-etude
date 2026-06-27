<?php

namespace App\Repositories;

use App\Models\Notification;

class NotificationRepository extends BaseRepository
{
    public function __construct(Notification $model)
    {
        parent::__construct($model);
    }

    public function pourUtilisateur(int $userId)
    {
        return $this->query()->where('utilisateur_id', $userId)->latest('id')->get();
    }

    public function marquerToutLu(int $userId): int
    {
        return $this->query()->where('utilisateur_id', $userId)->where('lu', false)->update(['lu' => true]);
    }
}
