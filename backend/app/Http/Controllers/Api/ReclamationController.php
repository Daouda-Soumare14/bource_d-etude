<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReclamationRequest;
use App\Http\Resources\ReclamationResource;
use App\Models\Reclamation;
use App\Services\EtudiantService;
use App\Services\ReclamationService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ReclamationController extends Controller
{
    public function __construct(
        protected ReclamationService $service,
        protected EtudiantService $etudiants,
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only('search', 'statut');

        // Un étudiant ne voit que ses propres réclamations.
        if ($request->user()->hasRole('etudiant')) {
            $etudiant = $this->etudiants->parUtilisateur($request->user()->id);
            $filters['etudiant_id'] = $etudiant?->id ?? 0;
        }

        $data = $this->service->liste($filters, $request->integer('per_page', 15));

        return ReclamationResource::collection($data);
    }

    public function store(ReclamationRequest $request)
    {
        $etudiant = $this->etudiants->parUtilisateur($request->user()->id);
        if (! $etudiant) {
            throw ValidationException::withMessages(['etudiant' => 'Profil étudiant introuvable.']);
        }

        $data = $request->safe()->except('document');
        $data['etudiant_id'] = $etudiant->id;
        $data['statut'] = Reclamation::STATUT_OUVERTE;

        if ($request->hasFile('document')) {
            $data['document'] = $request->file('document')->store('reclamations', 'public');
        }

        return new ReclamationResource($this->service->creer($data));
    }

    public function show(int $id)
    {
        return new ReclamationResource($this->service->trouver($id));
    }

    /** Le service répond à une réclamation. */
    public function repondre(Request $request, int $id)
    {
        $request->validate([
            'reponse' => ['required', 'string'],
            'statut' => ['nullable', 'in:Ouverte,En cours,Traitée,Fermée'],
        ]);

        return new ReclamationResource($this->service->repondre(
            $id,
            $request->input('reponse'),
            $request->input('statut', Reclamation::STATUT_TRAITEE),
        ));
    }

    public function destroy(int $id)
    {
        $this->service->supprimer($id);

        return response()->json(['message' => 'Réclamation supprimée.']);
    }
}
