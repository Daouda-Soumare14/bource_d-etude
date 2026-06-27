<?php

namespace App\Services;

use App\Models\DemandeBourse;
use App\Repositories\DemandeBourseRepository;
use Illuminate\Validation\ValidationException;

class DemandeBourseService extends BaseService
{
    protected array $relations = [
        'etudiant.utilisateur', 'annee', 'typeBourse', 'pieces', 'decision',
    ];

    public function __construct(
        DemandeBourseRepository $repository,
        protected NotificationService $notifications,
    ) {
        $this->repository = $repository;
    }

    public function creer(array $data): DemandeBourse
    {
        $data['statut'] = $data['statut'] ?? DemandeBourse::STATUT_BROUILLON;
        $data['date_demande'] = $data['date_demande'] ?? now()->toDateString();

        /** @var DemandeBourse $demande */
        $demande = $this->repository->create($data);

        return $demande->load($this->relations);
    }

    /** L'étudiant soumet sa demande (Brouillon → Soumise). */
    public function soumettre(int $id): DemandeBourse
    {
        $demande = $this->repository->findOrFail($id);
        $this->assurerStatut($demande, [DemandeBourse::STATUT_BROUILLON]);

        return $this->changerStatut($demande, DemandeBourse::STATUT_SOUMISE);
    }

    /** L'agent prend le dossier en vérification (Soumise → En vérification). */
    public function prendreEnCharge(int $id): DemandeBourse
    {
        $demande = $this->repository->findOrFail($id);
        $this->assurerStatut($demande, [DemandeBourse::STATUT_SOUMISE]);

        return $this->changerStatut($demande, DemandeBourse::STATUT_VERIFICATION);
    }

    /** L'agent rejette un dossier incomplet (→ Refusée). */
    public function rejeter(int $id, ?string $motif = null): DemandeBourse
    {
        $demande = $this->repository->findOrFail($id);
        $this->assurerStatut($demande, [
            DemandeBourse::STATUT_SOUMISE,
            DemandeBourse::STATUT_VERIFICATION,
        ]);

        $demande = $this->changerStatut($demande, DemandeBourse::STATUT_REFUSEE, $motif);
        $this->notifierEtudiant(
            $demande,
            'Demande de bourse refusée',
            "Votre demande de bourse a été refusée. Motif : " . ($motif ?: 'non précisé'),
            \App\Models\Notification::TYPE_DEMANDE_REFUSEE,
        );

        return $demande;
    }

    public function changerStatut(DemandeBourse $demande, string $statut, ?string $observation = null): DemandeBourse
    {
        $payload = ['statut' => $statut];
        if ($observation !== null) {
            $payload['observation'] = $observation;
        }
        $demande = $this->repository->update($demande->id, $payload);

        return $demande->load($this->relations);
    }

    public function notifierEtudiant(DemandeBourse $demande, string $titre, string $contenu, string $type): void
    {
        $demande->loadMissing('etudiant');
        if ($demande->etudiant) {
            $this->notifications->envoyer($demande->etudiant->utilisateur_id, $titre, $contenu, $type);
        }
    }

    private function assurerStatut(DemandeBourse $demande, array $statutsAutorises): void
    {
        if (! in_array($demande->statut, $statutsAutorises, true)) {
            throw ValidationException::withMessages([
                'statut' => "Action impossible : la demande est au statut « {$demande->statut} ».",
            ]);
        }
    }
}
