<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PieceJustificativeRequest;
use App\Http\Resources\PieceJustificativeResource;
use App\Services\PieceJustificativeService;
use Illuminate\Http\Request;

class PieceJustificativeController extends Controller
{
    public function __construct(protected PieceJustificativeService $service) {}

    /** Téléverse une pièce justificative pour une demande. */
    public function store(PieceJustificativeRequest $request)
    {
        $piece = $this->service->televerser(
            $request->validated('demande_id'),
            $request->validated('nom_document'),
            $request->file('fichier'),
        );

        return new PieceJustificativeResource($piece);
    }

    /** L'agent valide une pièce. */
    public function valider(int $id)
    {
        return new PieceJustificativeResource($this->service->valider($id));
    }

    /** L'agent rejette une pièce (demande de correction). */
    public function rejeter(Request $request, int $id)
    {
        $request->validate(['motif_rejet' => ['nullable', 'string']]);

        return new PieceJustificativeResource($this->service->rejeter($id, $request->input('motif_rejet')));
    }

    public function destroy(int $id)
    {
        $this->service->supprimer($id);

        return response()->json(['message' => 'Pièce supprimée.']);
    }
}
