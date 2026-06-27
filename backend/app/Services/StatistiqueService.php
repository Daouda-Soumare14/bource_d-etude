<?php

namespace App\Services;

use App\Models\DemandeBourse;
use App\Models\Etudiant;
use App\Models\Paiement;
use App\Models\Reclamation;
use Illuminate\Support\Facades\DB;

/**
 * Agrégations pour le tableau de bord (chiffres clés + données des graphiques).
 */
class StatistiqueService
{
    public function tableauDeBord(): array
    {
        return [
            'cartes' => $this->cartes(),
            'demandes_par_statut' => $this->demandesParStatut(),
            'demandes_par_region' => $this->demandesParRegion(),
            'demandes_par_universite' => $this->demandesParUniversite(),
            'evolution_annuelle' => $this->evolutionAnnuelle(),
            'paiements_mensuels' => $this->paiementsMensuels(),
        ];
    }

    /** Indicateurs clés (cartes du dashboard). */
    public function cartes(): array
    {
        return [
            'etudiants' => Etudiant::count(),
            'demandes' => DemandeBourse::count(),
            'demandes_acceptees' => DemandeBourse::where('statut', DemandeBourse::STATUT_ACCEPTEE)->count(),
            'paiements' => Paiement::where('statut', Paiement::STATUT_PAYE)->count(),
            'montant_total_distribue' => (float) Paiement::where('statut', Paiement::STATUT_PAYE)->sum('montant'),
            'reclamations' => Reclamation::count(),
            'reclamations_ouvertes' => Reclamation::where('statut', Reclamation::STATUT_OUVERTE)->count(),
        ];
    }

    public function demandesParStatut(): array
    {
        return DemandeBourse::select('statut', DB::raw('COUNT(*) as total'))
            ->groupBy('statut')
            ->pluck('total', 'statut')
            ->toArray();
    }

    public function demandesParRegion(): array
    {
        return DemandeBourse::join('etudiants', 'etudiants.id', '=', 'demandes_bourses.etudiant_id')
            ->select('etudiants.region', DB::raw('COUNT(*) as total'))
            ->groupBy('etudiants.region')
            ->orderByDesc('total')
            ->pluck('total', 'region')
            ->toArray();
    }

    public function demandesParUniversite(): array
    {
        return DemandeBourse::join('etudiants', 'etudiants.id', '=', 'demandes_bourses.etudiant_id')
            ->join('universites', 'universites.id', '=', 'etudiants.universite_id')
            ->select('universites.nom', DB::raw('COUNT(*) as total'))
            ->groupBy('universites.nom')
            ->orderByDesc('total')
            ->pluck('total', 'nom')
            ->toArray();
    }

    public function evolutionAnnuelle(): array
    {
        return DemandeBourse::join('annees_academiques', 'annees_academiques.id', '=', 'demandes_bourses.annee_id')
            ->select('annees_academiques.libelle', DB::raw('COUNT(*) as total'))
            ->groupBy('annees_academiques.libelle')
            ->orderBy('annees_academiques.libelle')
            ->pluck('total', 'libelle')
            ->toArray();
    }

    public function paiementsMensuels(): array
    {
        return Paiement::where('statut', Paiement::STATUT_PAYE)
            ->select(
                DB::raw("TO_CHAR(date_paiement, 'YYYY-MM') as mois"),
                DB::raw('SUM(montant) as total'),
            )
            ->groupBy('mois')
            ->orderBy('mois')
            ->pluck('total', 'mois')
            ->toArray();
    }
}
