<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:255'],
            'date_reunion' => ['nullable', 'date'],
            'description' => ['nullable', 'string'],
            'membres' => ['nullable', 'array'],
            'membres.*.utilisateur_id' => ['required_with:membres', 'exists:users,id'],
            'membres.*.role_membre' => ['nullable', 'string', 'max:50'],
        ];
    }
}
