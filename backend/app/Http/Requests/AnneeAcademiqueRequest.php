<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AnneeAcademiqueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('annee')?->id ?? $this->route('annee');

        return [
            'libelle' => ['required', 'string', 'max:20', Rule::unique('annees_academiques', 'libelle')->ignore($id)],
            'date_debut' => ['required', 'date'],
            'date_fin' => ['required', 'date', 'after:date_debut'],
            'active' => ['boolean'],
        ];
    }
}
