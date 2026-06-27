<?php

use App\Http\Controllers\Api\AnneeAcademiqueController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommissionController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DecisionController;
use App\Http\Controllers\Api\DemandeBourseController;
use App\Http\Controllers\Api\EtudiantController;
use App\Http\Controllers\Api\FaculteController;
use App\Http\Controllers\Api\FiliereController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PaiementController;
use App\Http\Controllers\Api\PieceJustificativeController;
use App\Http\Controllers\Api\ReclamationController;
use App\Http\Controllers\Api\TypeBourseController;
use App\Http\Controllers\Api\UniversiteController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes publiques (authentification)
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
});

/*
|--------------------------------------------------------------------------
| Routes protégées (token Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // --- Compte courant ---
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // --- Notifications (tout utilisateur connecté) ---
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::patch('notifications/{id}/lu', [NotificationController::class, 'marquerLu']);
    Route::post('notifications/tout-lu', [NotificationController::class, 'marquerToutLu']);

    // --- Tableau de bord / statistiques ---
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->middleware('permission:voir-statistiques');

    /*
    |------------------------------------------------------------------
    | Référentiels — lecture ouverte à tous, écriture réservée à l'admin
    |------------------------------------------------------------------
    */
    Route::apiResource('universites', UniversiteController::class)->only(['index', 'show']);
    Route::apiResource('facultes', FaculteController::class)->only(['index', 'show']);
    Route::apiResource('filieres', FiliereController::class)->only(['index', 'show']);
    Route::apiResource('annees', AnneeAcademiqueController::class)->only(['index', 'show'])
        ->parameters(['annees' => 'annee']);
    Route::apiResource('types-bourses', TypeBourseController::class)->only(['index', 'show'])
        ->parameters(['types-bourses' => 'type_bourse']);

    Route::middleware('permission:gerer-etablissements')->group(function () {
        Route::apiResource('universites', UniversiteController::class)->except(['index', 'show']);
        Route::apiResource('facultes', FaculteController::class)->except(['index', 'show']);
        Route::apiResource('filieres', FiliereController::class)->except(['index', 'show']);
    });

    Route::middleware('permission:gerer-annees')->group(function () {
        Route::apiResource('annees', AnneeAcademiqueController::class)->except(['index', 'show'])
            ->parameters(['annees' => 'annee']);
        Route::patch('annees/{id}/activer', [AnneeAcademiqueController::class, 'activer']);
    });

    Route::middleware('permission:gerer-types-bourses')->group(function () {
        Route::apiResource('types-bourses', TypeBourseController::class)->except(['index', 'show'])
            ->parameters(['types-bourses' => 'type_bourse']);
    });

    /*
    |------------------------------------------------------------------
    | Étudiants — gérés par l'administration / agents
    |------------------------------------------------------------------
    */
    Route::apiResource('etudiants', EtudiantController::class)
        ->middleware('permission:gerer-etudiants');

    /*
    |------------------------------------------------------------------
    | Demandes de bourse
    |------------------------------------------------------------------
    */
    Route::get('demandes', [DemandeBourseController::class, 'index']);
    Route::get('demandes/{id}', [DemandeBourseController::class, 'show']);
    Route::post('demandes', [DemandeBourseController::class, 'store']);
    Route::put('demandes/{id}', [DemandeBourseController::class, 'update']);
    Route::delete('demandes/{id}', [DemandeBourseController::class, 'destroy']);
    Route::post('demandes/{id}/soumettre', [DemandeBourseController::class, 'soumettre']);

    // Vérification des dossiers (Agent de traitement)
    Route::middleware('permission:verifier-dossiers')->group(function () {
        Route::post('demandes/{id}/prendre-en-charge', [DemandeBourseController::class, 'prendreEnCharge']);
        Route::post('demandes/{id}/rejeter', [DemandeBourseController::class, 'rejeter']);
        Route::patch('pieces/{id}/valider', [PieceJustificativeController::class, 'valider']);
        Route::patch('pieces/{id}/rejeter', [PieceJustificativeController::class, 'rejeter']);
    });

    // Pièces justificatives (upload par l'étudiant, suppression)
    Route::post('pieces', [PieceJustificativeController::class, 'store']);
    Route::delete('pieces/{id}', [PieceJustificativeController::class, 'destroy']);

    /*
    |------------------------------------------------------------------
    | Commissions & décisions
    |------------------------------------------------------------------
    */
    Route::apiResource('commissions', CommissionController::class)
        ->middleware('permission:gerer-commissions');
    Route::post('commissions/{commission}/membres', [CommissionController::class, 'affecterMembres'])
        ->middleware('permission:gerer-commissions');

    Route::middleware('permission:decider-demandes')->group(function () {
        Route::get('decisions', [DecisionController::class, 'index']);
        Route::get('decisions/{id}', [DecisionController::class, 'show']);
        Route::post('decisions', [DecisionController::class, 'store']);
    });

    /*
    |------------------------------------------------------------------
    | Paiements (Service financier)
    |------------------------------------------------------------------
    */
    Route::apiResource('paiements', PaiementController::class)
        ->middleware('permission:gerer-paiements');

    /*
    |------------------------------------------------------------------
    | Réclamations
    |------------------------------------------------------------------
    */
    Route::get('reclamations', [ReclamationController::class, 'index']);
    Route::get('reclamations/{id}', [ReclamationController::class, 'show']);
    Route::post('reclamations', [ReclamationController::class, 'store']);
    Route::delete('reclamations/{id}', [ReclamationController::class, 'destroy']);
    Route::post('reclamations/{id}/repondre', [ReclamationController::class, 'repondre'])
        ->middleware('permission:gerer-reclamations');

    /*
    |------------------------------------------------------------------
    | Gestion des utilisateurs (Administrateur)
    |------------------------------------------------------------------
    */
    Route::middleware('permission:gerer-utilisateurs')->group(function () {
        Route::get('roles', [UserController::class, 'roles']);
        Route::apiResource('users', UserController::class);
    });
});
