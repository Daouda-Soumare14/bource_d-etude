<?php

namespace App\Services;

use App\Models\DemandeBourse;
use App\Models\Notification;
use App\Models\Paiement;
use App\Repositories\PaiementRepository;
use Illuminate\Support\Facades\DB;

class PaiementService extends BaseService
{
    protected array $relations = ['decision.demande.etudiant'];

    public function __construct(
        PaiementRepository $repository,
        protected DemandeBourseService $demandes,
        protected NotificationService $notifications,
    ) {
        $this->repository = $repository;
    }

    /** Enregistre un paiement et bascule la demande en « Payée » si soldée. */
    public function enregistrer(array $data): Paiement
    {
        return DB::transaction(function () use ($data) {
            $data['statut'] = $data['statut'] ?? Paiement::STATUT_PAYE;
            $data['date_paiement'] = $data['date_paiement'] ?? now()->toDateString();

            /** @var Paiement $paiement */
            $paiement = $this->repository->create($data);
            $paiement->load($this->relations);

            $decision = $paiement->decision;

            if ($paiement->statut === Paiement::STATUT_PAYE && $decision) {
                // Notifier l'étudiant du versement.
                $this->demandes->notifierEtudiant(
                    $decision->demande,
                    'Paiement effectué',
                    "Un versement de {$paiement->montant} FCFA a été enregistré sur votre bourse.",
                    Notification::TYPE_PAIEMENT,
                );

                // Marquer la demande « Payée » si le montant accordé est soldé.
                if ($decision->resteAPayer() <= 0) {
                    $this->demandes->changerStatut($decision->demande, DemandeBourse::STATUT_PAYEE);
                }
            }

            return $paiement;
        });
    }
}
