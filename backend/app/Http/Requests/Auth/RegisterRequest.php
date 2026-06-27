<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:255'],
            'prenom' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'telephone' => ['nullable', 'string', 'max:30'],
            'adresse' => ['nullable', 'string', 'max:255'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
            // Champs profil étudiant
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
