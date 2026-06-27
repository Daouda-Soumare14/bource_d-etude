<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Reclamation;
use App\Repositories\ReclamationRepository;

class ReclamationService extends BaseService
{
    protected array $relations = ['etudiant.utilisateur', 'demande'];

    public function __construct(
        ReclamationRepository $repository,
        protected NotificationService $notifications,
    ) {
        $this->repository = $repository;
    }

    /** Répondre à une réclamation et notifier l'étudiant. */
    public function repondre(int $id, string $reponse, string $statut = Reclamation::STATUT_TRAITEE): Reclamation
    {
        /** @var Reclamation $reclamation */
        $reclamation = $this->repository->update($id, [
            'reponse' => $reponse,
            'statut' => $statut,
        ]);

        $reclamation->loadMissing('etudiant');
        if ($reclamation->etudiant) {
            $this->notifications->envoyer(
                $reclamation->etudiant->utilisateur_id,
                'Réponse à votre réclamation',
                "Votre réclamation « {$reclamation->objet} » a reçu une réponse.",
                Notification::TYPE_RECLAMATION,
            );
        }

        return $reclamation->load($this->relations);
    }
}
