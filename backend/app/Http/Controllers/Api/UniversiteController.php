<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UniversiteRequest;
use App\Http\Resources\UniversiteResource;
use App\Services\UniversiteService;
use Illuminate\Http\Request;

class UniversiteController extends Controller
{
    public function __construct(protected UniversiteService $service) {}

    public function index(Request $request)
    {
        $data = $this->service->liste($request->only('search', 'type', 'region'), $request->integer('per_page', 15));

        return UniversiteResource::collection($data);
    }

    public function store(UniversiteRequest $request)
    {
        $universite = $this->service->creer($request->validated());

        return new UniversiteResource($universite);
    }

    public function show(int $id)
    {
        return new UniversiteResource($this->service->trouver($id));
    }

    public function update(UniversiteRequest $request, int $id)
    {
        return new UniversiteResource($this->service->modifier($id, $request->validated()));
    }

    public function destroy(int $id)
    {
        $this->service->supprimer($id);

        return response()->json(['message' => 'Université supprimée.']);
    }
}
