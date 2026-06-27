<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UniversiteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:255'],
            'sigle' => ['nullable', 'string', 'max:50'],
            'type' => ['nullable', 'in:universite,ecole,institut'],
            'adresse' => ['nullable', 'string', 'max:255'],
            'telephone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'region' => ['nullable', 'string', 'max:100'],
        ];
    }
}
