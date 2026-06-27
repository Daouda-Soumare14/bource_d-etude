<?php

namespace App\Services;

use App\Models\Notification;
use App\Repositories\NotificationRepository;
use Illuminate\Database\Eloquent\Collection;

class NotificationService extends BaseService
{
    public function __construct(NotificationRepository $repository)
    {
        $this->repository = $repository;
    }

    /** Créer et envoyer une notification applicative à un utilisateur. */
    public function envoyer(int $utilisateurId, string $titre, string $contenu, string $type = Notification::TYPE_INFO): Notification
    {
        return $this->repository->create([
            'utilisateur_id' => $utilisateurId,
            'titre' => $titre,
            'contenu' => $contenu,
            'type' => $type,
            'lu' => false,
        ]);
    }

    public function pourUtilisateur(int $utilisateurId): Collection
    {
        return $this->repository->pourUtilisateur($utilisateurId);
    }

    public function marquerLu(int $id): Notification
    {
        return $this->repository->update($id, ['lu' => true]);
    }

    public function marquerToutLu(int $utilisateurId): int
    {
        return $this->repository->marquerToutLu($utilisateurId);
    }
}
