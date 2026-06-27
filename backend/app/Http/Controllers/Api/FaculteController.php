<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FaculteRequest;
use App\Http\Resources\FaculteResource;
use App\Services\FaculteService;
use Illuminate\Http\Request;

class FaculteController extends Controller
{
    public function __construct(protected FaculteService $service) {}

    public function index(Request $request)
    {
        $data = $this->service->liste($request->only('search', 'universite_id'), $request->integer('per_page', 15));

        return FaculteResource::collection($data);
    }

    public function store(FaculteRequest $request)
    {
        return new FaculteResource($this->service->creer($request->validated()));
    }

    public function show(int $id)
    {
        return new FaculteResource($this->service->trouver($id));
    }

    public function update(FaculteRequest $request, int $id)
    {
        return new FaculteResource($this->service->modifier($id, $request->validated()));
    }

    public function destroy(int $id)
    {
        $this->service->supprimer($id);

        return response()->json(['message' => 'Faculté supprimée.']);
    }
}
