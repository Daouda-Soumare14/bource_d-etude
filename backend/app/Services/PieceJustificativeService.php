<?php

namespace App\Services;

use App\Models\PieceJustificative;
use App\Repositories\PieceJustificativeRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PieceJustificativeService extends BaseService
{
    protected array $relations = ['demande'];

    public function __construct(PieceJustificativeRepository $repository)
    {
        $this->repository = $repository;
    }

    /** Enregistre une pièce justificative avec le fichier uploadé. */
    public function televerser(int $demandeId, string $nomDocument, UploadedFile $fichier): PieceJustificative
    {
        $chemin = $fichier->store("pieces/{$demandeId}", 'public');

        return $this->repository->create([
            'demande_id' => $demandeId,
            'nom_document' => $nomDocument,
            'chemin' => $chemin,
            'statut' => PieceJustificative::STATUT_ATTENTE,
        ]);
    }

    public function valider(int $id): PieceJustificative
    {
        return $this->repository->update($id, ['statut' => PieceJustificative::STATUT_VALIDEE, 'motif_rejet' => null]);
    }

    public function rejeter(int $id, ?string $motif = null): PieceJustificative
    {
        return $this->repository->update($id, [
            'statut' => PieceJustificative::STATUT_REJETEE,
            'motif_rejet' => $motif,
        ]);
    }

    public function supprimer(int $id): bool
    {
        $piece = $this->repository->findOrFail($id);
        if ($piece->chemin && Storage::disk('public')->exists($piece->chemin)) {
            Storage::disk('public')->delete($piece->chemin);
        }

        return $this->repository->delete($id);
    }
}
