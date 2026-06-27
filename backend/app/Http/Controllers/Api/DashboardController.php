<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StatistiqueService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(protected StatistiqueService $service) {}

    /** Données complètes du tableau de bord (cartes + graphiques). */
    public function index(): JsonResponse
    {
        return response()->json(['data' => $this->service->tableauDeBord()]);
    }
}
