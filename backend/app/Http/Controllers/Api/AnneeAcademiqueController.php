<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnneeAcademiqueRequest;
use App\Http\Resources\AnneeAcademiqueResource;
use App\Services\AnneeAcademiqueService;
use Illuminate\Http\Request;

class AnneeAcademiqueController extends Controller
{
    public function __construct(protected AnneeAcademiqueService $service) {}

    public function index(Request $request)
    {
        $data = $this->service->liste($request->only('search'), $request->integer('per_page', 50));

        return AnneeAcademiqueResource::collection($data);
    }

    public function store(AnneeAcademiqueRequest $request)
    {
        return new AnneeAcademiqueResource($this->service->creer($request->validated()));
    }

    public function show(int $id)
    {
        return new AnneeAcademiqueResource($this->service->trouver($id));
    }

    public function update(AnneeAcademiqueRequest $request, int $id)
    {
        return new AnneeAcademiqueResource($this->service->modifier($id, $request->validated()));
    }

    public function destroy(int $id)
    {
        $this->service->supprimer($id);

        return response()->json(['message' => 'Année académique supprimée.']);
    }

    /** Définit l'année académique active. */
    public function activer(int $id)
    {
        return new AnneeAcademiqueResource($this->service->activer($id));
    }
}
