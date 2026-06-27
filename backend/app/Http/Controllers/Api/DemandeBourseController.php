<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DemandeBourseRequest;
use App\Http\Resources\DemandeBourseResource;
use App\Services\DemandeBourseService;
use App\Services\EtudiantService;
use Illuminate\Http\Request;

class DemandeBourseController extends Controller
{
    public function __construct(
        protected DemandeBourseService $service,
        protected EtudiantService $etudiants,
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only('search', 'statut', 'annee_id', 'type_bourse_id', 'etudiant_id');

        // Un étudiant ne voit que ses propres demandes.
        if ($request->user()->hasRole('etudiant')) {
            $etudiant = $this->etudiants->parUtilisateur($request->user()->id);
            $filters['etudiant_id'] = $etudiant?->id ?? 0;
        }

        $data = $this->service->liste($filters, $request->integer('per_page', 15));

        return DemandeBourseResource::collection($data);
    }

    public function store(DemandeBourseRequest $request)
    {
        return new DemandeBourseResource($this->service->creer($request->validated()));
    }

    public function show(int $id)
    {
        return new DemandeBourseResource($this->service->trouver($id));
    }

    public function update(DemandeBourseRequest $request, int $id)
    {
        return new DemandeBourseResource($this->service->modifier($id, $request->validated()));
    }

    public function destroy(int $id)
    {
        $this->service->supprimer($id);

        return response()->json(['message' => 'Demande supprimée.']);
    }

    /** L'étudiant soumet sa demande (Brouillon → Soumise). */
    public function soumettre(int $id)
    {
        return new DemandeBourseResource($this->service->soumettre($id));
    }

    /** L'agent prend le dossier en vérification. */
    public function prendreEnCharge(int $id)
    {
        return new DemandeBourseResource($this->service->prendreEnCharge($id));
    }

    /** L'agent rejette un dossier incomplet. */
    public function rejeter(Request $request, int $id)
    {
        $request->validate(['motif' => ['nullable', 'string']]);

        return new DemandeBourseResource($this->service->rejeter($id, $request->input('motif')));
    }
}
