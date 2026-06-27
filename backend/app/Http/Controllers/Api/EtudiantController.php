<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EtudiantRequest;
use App\Http\Resources\EtudiantResource;
use App\Services\EtudiantService;
use Illuminate\Http\Request;

class EtudiantController extends Controller
{
    public function __construct(protected EtudiantService $service) {}

    public function index(Request $request)
    {
        $data = $this->service->liste(
            $request->only('search', 'universite_id', 'faculte_id', 'filiere_id', 'niveau', 'region'),
            $request->integer('per_page', 15),
        );

        return EtudiantResource::collection($data);
    }

    public function store(EtudiantRequest $request)
    {
        return new EtudiantResource($this->service->creer($request->validated()));
    }

    public function show(int $id)
    {
        return new EtudiantResource($this->service->trouver($id));
    }

    public function update(EtudiantRequest $request, int $id)
    {
        return new EtudiantResource($this->service->modifier($id, $request->validated()));
    }

    public function destroy(int $id)
    {
        $this->service->supprimer($id);

        return response()->json(['message' => 'Étudiant supprimé.']);
    }
}
