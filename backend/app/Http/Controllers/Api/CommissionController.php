<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommissionRequest;
use App\Http\Resources\CommissionResource;
use App\Services\CommissionService;
use Illuminate\Http\Request;

class CommissionController extends Controller
{
    public function __construct(protected CommissionService $service) {}

    public function index(Request $request)
    {
        $data = $this->service->liste($request->only('search'), $request->integer('per_page', 15));

        return CommissionResource::collection($data);
    }

    public function store(CommissionRequest $request)
    {
        $commission = $this->service->creer($request->safe()->except('membres'));

        if ($request->filled('membres')) {
            $commission = $this->service->affecterMembres($commission->id, $request->validated('membres'));
        }

        return new CommissionResource($commission->load('membres'));
    }

    public function show(int $id)
    {
        return new CommissionResource($this->service->trouver($id));
    }

    public function update(CommissionRequest $request, int $id)
    {
        $commission = $this->service->modifier($id, $request->safe()->except('membres'));

        if ($request->has('membres')) {
            $commission = $this->service->affecterMembres($id, $request->validated('membres') ?? []);
        }

        return new CommissionResource($commission->load('membres'));
    }

    public function destroy(int $id)
    {
        $this->service->supprimer($id);

        return response()->json(['message' => 'Commission supprimée.']);
    }

    /** Affecte / synchronise les membres d'une commission. */
    public function affecterMembres(Request $request, int $id)
    {
        $request->validate([
            'membres' => ['required', 'array'],
            'membres.*.utilisateur_id' => ['required', 'exists:users,id'],
            'membres.*.role_membre' => ['nullable', 'string', 'max:50'],
        ]);

        return new CommissionResource($this->service->affecterMembres($id, $request->input('membres')));
    }
}
