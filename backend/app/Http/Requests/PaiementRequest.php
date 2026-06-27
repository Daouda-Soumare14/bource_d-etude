<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaiementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'decision_id' => ['required', 'exists:decisions,id'],
            'montant' => ['required', 'numeric', 'min:1'],
            'date_paiement' => ['nullable', 'date'],
            'mode_paiement' => ['nullable', 'string', 'max:50'],
            'reference' => ['nullable', 'string', 'max:100'],
            'statut' => ['nullable', 'in:payé,en attente,annulé'],
        ];
    }
}
