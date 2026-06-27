<?php

namespace Database\Seeders;

use App\Models\AnneeAcademique;
use App\Models\Commission;
use App\Models\Decision;
use App\Models\DemandeBourse;
use App\Models\Etudiant;
use App\Models\Faculte;
use App\Models\Filiere;
use App\Models\Notification;
use App\Models\Paiement;
use App\Models\Reclamation;
use App\Models\TypeBourse;
use App\Models\Universite;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $annee = AnneeAcademique::where('active', true)->first();
        $types = TypeBourse::all();
        $universites = Universite::with('facultes.filieres')->get();

        // --- Commission de validation ---
        $commission = Commission::firstOrCreate(
            ['nom' => 'Commission nationale des bourses 2025-2026'],
            ['date_reunion' => now()->subDays(10)->toDateString(), 'description' => 'Commission d\'attribution des bourses.'],
        );
        $membreCommission = User::where('email', 'commission@dgbe.sn')->first();
        if ($membreCommission) {
            $commission->membres()->syncWithoutDetaching([
                $membreCommission->id => ['role_membre' => 'président'],
            ]);
        }

        // --- 24 étudiants avec demandes ---
        for ($i = 1; $i <= 24; $i++) {
            $universite = $universites->random();
            $faculte = $universite->facultes->random();
            /** @var Filiere $filiere */
            $filiere = $faculte->filieres->random();

            $user = User::create([
                'nom' => fake()->lastName(),
                'prenom' => fake()->firstName(),
                'email' => "etudiant{$i}@dgbe.sn",
                'telephone' => '70' . random_int(1000000, 9999999),
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'actif' => true,
            ]);
            $user->assignRole('etudiant');

            $etudiant = Etudiant::factory()->create([
                'utilisateur_id' => $user->id,
                'universite_id' => $universite->id,
                'faculte_id' => $faculte->id,
                'filiere_id' => $filiere->id,
            ]);

            $type = $types->random();
            // Répartition des statuts pour un dashboard réaliste.
            $statut = fake()->randomElement([
                DemandeBourse::STATUT_SOUMISE,
                DemandeBourse::STATUT_VERIFICATION,
                DemandeBourse::STATUT_ACCEPTEE,
                DemandeBourse::STATUT_ACCEPTEE,
                DemandeBourse::STATUT_REFUSEE,
                DemandeBourse::STATUT_PAYEE,
            ]);

            $demande = DemandeBourse::factory()->create([
                'etudiant_id' => $etudiant->id,
                'annee_id' => $annee->id,
                'type_bourse_id' => $type->id,
                'montant_demande' => $type->montant,
                'statut' => $statut,
            ]);

            // Décisions + paiements pour les demandes acceptées/payées.
            if (in_array($statut, [DemandeBourse::STATUT_ACCEPTEE, DemandeBourse::STATUT_PAYEE], true)) {
                $decision = Decision::create([
                    'commission_id' => $commission->id,
                    'demande_id' => $demande->id,
                    'decision' => Decision::ACCEPTEE,
                    'observation' => 'Dossier complet et conforme.',
                    'montant_accorde' => $type->montant,
                    'date_decision' => now()->subDays(random_int(1, 30))->toDateString(),
                ]);

                if ($statut === DemandeBourse::STATUT_PAYEE) {
                    // Versements mensuels sur plusieurs mois.
                    $mensualite = round($type->montant / 3, 2);
                    for ($m = 0; $m < 3; $m++) {
                        Paiement::create([
                            'decision_id' => $decision->id,
                            'montant' => $mensualite,
                            'date_paiement' => now()->subMonths(3 - $m)->toDateString(),
                            'mode_paiement' => fake()->randomElement(['Virement', 'Mobile Money', 'Chèque']),
                            'reference' => 'PAY-' . strtoupper(fake()->bothify('####??')),
                            'statut' => Paiement::STATUT_PAYE,
                        ]);
                    }
                }
            } elseif ($statut === DemandeBourse::STATUT_REFUSEE) {
                Decision::create([
                    'commission_id' => $commission->id,
                    'demande_id' => $demande->id,
                    'decision' => Decision::REFUSEE,
                    'observation' => 'Dossier incomplet.',
                    'montant_accorde' => 0,
                    'date_decision' => now()->subDays(random_int(1, 30))->toDateString(),
                ]);
            }

            // Quelques réclamations + notifications.
            if ($i % 6 === 0) {
                Reclamation::create([
                    'etudiant_id' => $etudiant->id,
                    'demande_id' => $demande->id,
                    'objet' => 'Retard de paiement',
                    'description' => 'Je n\'ai pas encore reçu mon versement.',
                    'statut' => Reclamation::STATUT_OUVERTE,
                ]);
            }

            Notification::create([
                'utilisateur_id' => $user->id,
                'titre' => 'Bienvenue sur la plateforme DGBE',
                'contenu' => 'Votre compte étudiant a été créé avec succès.',
                'type' => Notification::TYPE_INFO,
                'lu' => false,
            ]);
        }
    }
}
