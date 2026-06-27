<?php

namespace App\Services;

use App\Models\Decision;
use App\Models\DemandeBourse;
use App\Models\Notification;
use App\Repositories\DecisionRepository;
use Illuminate\Support\Facades\DB;

class DecisionService extends BaseService
{
    protected array $relations = ['commission', 'demande.etudiant'];

    public function __construct(
        DecisionRepository $repository,
        protected DemandeBourseService $demandes,
        protected NotificationService $notifications,
    ) {
        $this->repository = $repository;
    }

    /**
     * La commission statue sur une demande : crée la décision,
     * met à jour le statut de la demande et notifie l'étudiant.
     */
    public function statuer(array $data): Decision
    {
        return DB::transaction(function () use ($data) {
            $data['date_decision'] = $data['date_decision'] ?? now()->toDateString();
            $accepte = $data['decision'] === Decision::ACCEPTEE;

            if (! $accepte) {
                $data['montant_accorde'] = 0;
            }

            /** @var Decision $decision */
            $decision = $this->repository->create($data);

            $demande = $decision->demande;
            $nouveauStatut = $accepte ? DemandeBourse::STATUT_ACCEPTEE : DemandeBourse::STATUT_REFUSEE;
            $this->demandes->changerStatut($demande, $nouveauStatut, $data['observation'] ?? null);

            $this->demandes->notifierEtudiant(
                $demande,
                $accepte ? 'Demande de bourse acceptée' : 'Demande de bourse refusée',
                $accepte
                    ? "Félicitations ! Votre bourse a été accordée pour un montant de {$decision->montant_accorde} FCFA."
                    : 'Votre demande de bourse a été refusée par la commission.',
                $accepte ? Notification::TYPE_DEMANDE_ACCEPTEE : Notification::TYPE_DEMANDE_REFUSEE,
            );

            return $decision->load($this->relations);
        });
    }
}
