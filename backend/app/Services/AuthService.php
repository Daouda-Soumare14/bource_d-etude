<?php

namespace App\Services;

use App\Models\Etudiant;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        protected UserRepository $users,
    ) {}

    /**
     * Inscription d'un étudiant : crée le compte utilisateur, le profil
     * étudiant associé et affecte le rôle « etudiant ».
     */
    public function inscrireEtudiant(array $data): User
    {
        return DB::transaction(function () use ($data) {
            /** @var User $user */
            $user = $this->users->create([
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'email' => $data['email'],
                'telephone' => $data['telephone'] ?? null,
                'adresse' => $data['adresse'] ?? null,
                'password' => $data['password'],
            ]);

            $user->assignRole('etudiant');

            Etudiant::create([
                'utilisateur_id' => $user->id,
                'matricule' => $this->genererMatricule(),
                'date_naissance' => $data['date_naissance'] ?? null,
                'sexe' => $data['sexe'] ?? null,
                'region' => $data['region'] ?? null,
                'universite_id' => $data['universite_id'] ?? null,
                'faculte_id' => $data['faculte_id'] ?? null,
                'filiere_id' => $data['filiere_id'] ?? null,
                'niveau' => $data['niveau'] ?? null,
            ]);

            event(new Registered($user));

            return $user->load('etudiant', 'roles');
        });
    }

    /** Authentifie un utilisateur et retourne un token Sanctum. */
    public function connexion(string $email, string $password): array
    {
        $user = $this->users->parEmail($email);

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        if (! $user->actif) {
            throw ValidationException::withMessages([
                'email' => ['Ce compte est désactivé.'],
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return [
            'user' => $user->load('roles', 'etudiant'),
            'token' => $token,
        ];
    }

    public function deconnexion(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }

    private function genererMatricule(): string
    {
        $annee = now()->format('Y');
        do {
            $matricule = 'ETU' . $annee . str_pad((string) random_int(1, 99999), 5, '0', STR_PAD_LEFT);
        } while (Etudiant::where('matricule', $matricule)->exists());

        return $matricule;
    }
}
