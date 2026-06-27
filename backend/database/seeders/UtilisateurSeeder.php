<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UtilisateurSeeder extends Seeder
{
    public function run(): void
    {
        $comptes = [
            ['nom' => 'Diop', 'prenom' => 'Administrateur', 'email' => 'admin@dgbe.sn', 'role' => 'administrateur'],
            ['nom' => 'Ndiaye', 'prenom' => 'Agent', 'email' => 'agent@dgbe.sn', 'role' => 'agent'],
            ['nom' => 'Fall', 'prenom' => 'Commission', 'email' => 'commission@dgbe.sn', 'role' => 'commission'],
            ['nom' => 'Sow', 'prenom' => 'Finance', 'email' => 'finance@dgbe.sn', 'role' => 'service-financier'],
        ];

        foreach ($comptes as $compte) {
            $user = User::firstOrCreate(
                ['email' => $compte['email']],
                [
                    'nom' => $compte['nom'],
                    'prenom' => $compte['prenom'],
                    'telephone' => '77' . random_int(1000000, 9999999),
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'actif' => true,
                ],
            );

            $user->syncRoles([$compte['role']]);
        }
    }
}
