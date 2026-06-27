<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordRule;

class AuthController extends Controller
{
    public function __construct(protected AuthService $authService) {}

    /** Inscription d'un étudiant. */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = $this->authService->inscrireEtudiant($request->validated());

        return response()->json([
            'message' => 'Compte créé avec succès. Un email de vérification vous a été envoyé.',
            'data' => new UserResource($user),
        ], 201);
    }

    /** Connexion (retourne un token Sanctum). */
    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->connexion(
            $request->validated('email'),
            $request->validated('password'),
        );

        return response()->json([
            'message' => 'Connexion réussie.',
            'token' => $result['token'],
            'token_type' => 'Bearer',
            'data' => new UserResource($result['user']),
        ]);
    }

    /** Profil de l'utilisateur connecté. */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => new UserResource($request->user()->load('roles', 'etudiant.universite', 'etudiant.faculte', 'etudiant.filiere')),
        ]);
    }

    /** Déconnexion (révoque le token courant). */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->deconnexion($request->user());

        return response()->json(['message' => 'Déconnexion réussie.']);
    }

    /** Demande de réinitialisation du mot de passe (envoie un lien par email). */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($request->only('email'));

        return response()->json(['message' => __($status)]);
    }

    /** Réinitialisation effective du mot de passe. */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill(['password' => $password])->save();
            },
        );

        return response()->json(['message' => __($status)]);
    }
}
