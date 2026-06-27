<?php

namespace Database\Seeders;

use App\Models\AnneeAcademique;
use App\Models\Faculte;
use App\Models\Filiere;
use App\Models\TypeBourse;
use App\Models\Universite;
use Illuminate\Database\Seeder;

class ReferentielSeeder extends Seeder
{
    public function run(): void
    {
        // --- Années académiques ---
        AnneeAcademique::firstOrCreate(['libelle' => '2024-2025'], [
            'date_debut' => '2024-10-01', 'date_fin' => '2025-07-31', 'active' => false,
        ]);
        AnneeAcademique::firstOrCreate(['libelle' => '2025-2026'], [
            'date_debut' => '2025-10-01', 'date_fin' => '2026-07-31', 'active' => true,
        ]);

        // --- Types de bourses ---
        $types = [
            ['nom' => 'Bourse entière', 'montant' => 720000, 'description' => 'Bourse complète couvrant l\'année académique.'],
            ['nom' => 'Demi-bourse', 'montant' => 360000, 'description' => 'Bourse partielle (50%).'],
            ['nom' => 'Aide sociale', 'montant' => 180000, 'description' => 'Aide ponctuelle aux étudiants en difficulté.'],
            ['nom' => 'Bourse d\'excellence', 'montant' => 900000, 'description' => 'Récompense les meilleurs résultats académiques.'],
        ];
        foreach ($types as $type) {
            TypeBourse::firstOrCreate(['nom' => $type['nom']], $type);
        }

        // --- Universités, facultés et filières (Sénégal) ---
        $universites = [
            [
                'nom' => 'Université Cheikh Anta Diop', 'sigle' => 'UCAD', 'region' => 'Dakar',
                'facultes' => [
                    'Faculté des Sciences et Techniques' => ['Mathématiques', 'Informatique', 'Physique-Chimie'],
                    'Faculté des Sciences Économiques et de Gestion' => ['Gestion', 'Économie', 'Comptabilité'],
                    'Faculté de Médecine' => ['Médecine générale', 'Pharmacie', 'Odontologie'],
                ],
            ],
            [
                'nom' => 'Université Gaston Berger', 'sigle' => 'UGB', 'region' => 'Saint-Louis',
                'facultes' => [
                    'UFR Sciences Appliquées et Technologie' => ['Informatique', 'Télécommunications'],
                    'UFR Sciences Juridiques et Politiques' => ['Droit privé', 'Droit public'],
                ],
            ],
            [
                'nom' => 'Université de Thiès', 'sigle' => 'UT', 'region' => 'Thiès',
                'facultes' => [
                    'École Polytechnique de Thiès' => ['Génie civil', 'Génie informatique'],
                    'UFR Sciences de la Santé' => ['Soins infirmiers', 'Médecine'],
                ],
            ],
            [
                'nom' => 'Université Assane Seck de Ziguinchor', 'sigle' => 'UASZ', 'region' => 'Ziguinchor',
                'facultes' => [
                    'UFR Sciences et Technologies' => ['Informatique', 'Agroforesterie'],
                    'UFR Sciences Économiques et Sociales' => ['Économie', 'Sociologie'],
                ],
            ],
        ];

        foreach ($universites as $u) {
            $universite = Universite::firstOrCreate(
                ['nom' => $u['nom']],
                ['sigle' => $u['sigle'], 'type' => 'universite', 'region' => $u['region']],
            );

            foreach ($u['facultes'] as $nomFaculte => $filieres) {
                $faculte = Faculte::firstOrCreate([
                    'universite_id' => $universite->id,
                    'nom' => $nomFaculte,
                ]);

                foreach ($filieres as $nomFiliere) {
                    Filiere::firstOrCreate([
                        'faculte_id' => $faculte->id,
                        'nom' => $nomFiliere,
                    ]);
                }
            }
        }
    }
}
