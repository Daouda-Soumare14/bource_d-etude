<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FaculteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'universite_id' => ['required', 'exists:universites,id'],
            'nom' => ['required', 'string', 'max:255'],
        ];
    }
}
