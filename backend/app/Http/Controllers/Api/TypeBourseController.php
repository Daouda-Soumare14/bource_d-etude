<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TypeBourseRequest;
use App\Http\Resources\TypeBourseResource;
use App\Services\TypeBourseService;
use Illuminate\Http\Request;

class TypeBourseController extends Controller
{
    public function __construct(protected TypeBourseService $service) {}

    public function index(Request $request)
    {
        $data = $this->service->liste($request->only('search'), $request->integer('per_page', 50));

        return TypeBourseResource::collection($data);
    }

    public function store(TypeBourseRequest $request)
    {
        return new TypeBourseResource($this->service->creer($request->validated()));
    }

    public function show(int $id)
    {
        return new TypeBourseResource($this->service->trouver($id));
    }

    public function update(TypeBourseRequest $request, int $id)
    {
        return new TypeBourseResource($this->service->modifier($id, $request->validated()));
    }

    public function destroy(int $id)
    {
        $this->service->supprimer($id);

        return response()->json(['message' => 'Type de bourse supprimé.']);
    }
}
