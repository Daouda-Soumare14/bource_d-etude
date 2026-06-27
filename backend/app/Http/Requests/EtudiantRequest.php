<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EtudiantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('etudiant')?->id ?? $this->route('etudiant');

        return [
            'matricule' => ['required', 'string', 'max:50', Rule::unique('etudiants', 'matricule')->ignore($id)],
            'date_naissance' => ['nullable', 'date'],
            'sexe' => ['nullable', 'in:M,F'],
            'region' => ['nullable', 'string', 'max:100'],
            'universite_id' => ['nullable', 'exists:universites,id'],
            'faculte_id' => ['nullable', 'exists:facultes,id'],
            'filiere_id' => ['nullable', 'exists:filieres,id'],
            'niveau' => ['nullable', 'string', 'max:20'],
        ];
    }
}
