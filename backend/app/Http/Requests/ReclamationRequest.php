<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReclamationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'demande_id' => ['nullable', 'exists:demandes_bourses,id'],
            'objet' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'document' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ];
    }
}
