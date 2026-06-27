<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TypeBourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:255'],
            'montant' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
        ];
    }
}
