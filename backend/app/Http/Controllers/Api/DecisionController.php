<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DecisionRequest;
use App\Http\Resources\DecisionResource;
use App\Services\DecisionService;
use Illuminate\Http\Request;

class DecisionController extends Controller
{
    public function __construct(protected DecisionService $service) {}

    public function index(Request $request)
    {
        $data = $this->service->liste($request->only('commission_id', 'demande_id'), $request->integer('per_page', 15));

        return DecisionResource::collection($data);
    }

    /** La commission statue sur une demande (accepte / refuse). */
    public function store(DecisionRequest $request)
    {
        return new DecisionResource($this->service->statuer($request->validated()));
    }

    public function show(int $id)
    {
        return new DecisionResource($this->service->trouver($id));
    }
}
