<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DemandeBourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'etudiant_id' => ['required', 'exists:etudiants,id'],
            'annee_id' => ['required', 'exists:annees_academiques,id'],
            'type_bourse_id' => ['required', 'exists:types_bourses,id'],
            'date_demande' => ['nullable', 'date'],
            'montant_demande' => ['nullable', 'numeric', 'min:0'],
            'observation' => ['nullable', 'string'],
        ];
    }
}
