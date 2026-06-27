<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed de l'application (ordre important : rôles → référentiels → comptes → démo).
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            ReferentielSeeder::class,
            UtilisateurSeeder::class,
            DemoSeeder::class,
        ]);
    }
}
