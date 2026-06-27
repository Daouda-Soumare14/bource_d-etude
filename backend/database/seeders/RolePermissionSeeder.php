<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // --- Permissions ---
        $permissions = [
            'gerer-utilisateurs',
            'gerer-etablissements',
            'gerer-etudiants',
            'gerer-annees',
            'gerer-types-bourses',
            'gerer-commissions',
            'verifier-dossiers',
            'decider-demandes',
            'gerer-paiements',
            'gerer-reclamations',
            'voir-statistiques',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // --- Rôles et leurs permissions ---
        $roles = [
            'administrateur' => $permissions, // tous les droits
            'agent' => ['gerer-etudiants', 'verifier-dossiers', 'voir-statistiques'],
            'commission' => ['decider-demandes', 'voir-statistiques'],
            'service-financier' => ['gerer-paiements', 'voir-statistiques'],
            'etudiant' => [], // utilise ses propres routes (demandes, réclamations)
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($rolePermissions);
        }
    }
}
