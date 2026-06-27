<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FiliereRequest;
use App\Http\Resources\FiliereResource;
use App\Services\FiliereService;
use Illuminate\Http\Request;

class FiliereController extends Controller
{
    public function __construct(protected FiliereService $service) {}

    public function index(Request $request)
    {
        $data = $this->service->liste($request->only('search', 'faculte_id'), $request->integer('per_page', 15));

        return FiliereResource::collection($data);
    }

    public function store(FiliereRequest $request)
    {
        return new FiliereResource($this->service->creer($request->validated()));
    }

    public function show(int $id)
    {
        return new FiliereResource($this->service->trouver($id));
    }

    public function update(FiliereRequest $request, int $id)
    {
        return new FiliereResource($this->service->modifier($id, $request->validated()));
    }

    public function destroy(int $id)
    {
        $this->service->supprimer($id);

        return response()->json(['message' => 'Filière supprimée.']);
    }
}
