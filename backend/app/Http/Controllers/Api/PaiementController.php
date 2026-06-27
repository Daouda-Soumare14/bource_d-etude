<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaiementRequest;
use App\Http\Resources\PaiementResource;
use App\Services\PaiementService;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    public function __construct(protected PaiementService $service) {}

    public function index(Request $request)
    {
        $data = $this->service->liste(
            $request->only('statut', 'decision_id', 'reference'),
            $request->integer('per_page', 15),
        );

        return PaiementResource::collection($data);
    }

    /** Enregistre un paiement (versement). */
    public function store(PaiementRequest $request)
    {
        return new PaiementResource($this->service->enregistrer($request->validated()));
    }

    public function show(int $id)
    {
        return new PaiementResource($this->service->trouver($id));
    }

    public function update(PaiementRequest $request, int $id)
    {
        return new PaiementResource($this->service->modifier($id, $request->validated()));
    }

    public function destroy(int $id)
    {
        $this->service->supprimer($id);

        return response()->json(['message' => 'Paiement annulé.']);
    }
}
