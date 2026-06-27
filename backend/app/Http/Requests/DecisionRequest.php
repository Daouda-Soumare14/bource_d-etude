<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DecisionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'commission_id' => ['required', 'exists:commissions,id'],
            'demande_id' => ['required', 'exists:demandes_bourses,id', 'unique:decisions,demande_id'],
            'decision' => ['required', 'in:Acceptée,Refusée'],
            'observation' => ['nullable', 'string'],
            'montant_accorde' => ['nullable', 'numeric', 'min:0'],
            'date_decision' => ['nullable', 'date'],
        ];
    }
}
