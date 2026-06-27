<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PieceJustificativeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'demande_id' => ['required', 'exists:demandes_bourses,id'],
            'nom_document' => ['required', 'string', 'max:255'],
            'fichier' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ];
    }
}
