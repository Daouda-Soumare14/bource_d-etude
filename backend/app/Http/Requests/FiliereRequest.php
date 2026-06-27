<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FiliereRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'faculte_id' => ['required', 'exists:facultes,id'],
            'nom' => ['required', 'string', 'max:255'],
        ];
    }
}
