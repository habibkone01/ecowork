<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateEspaceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'nom' => 'sometimes|string|max:255',
            'surface' => 'sometimes|numeric|min:1',
            'type' => 'sometimes|in:bureau,salle de réunion,conférence',
            'capacite' => 'sometimes|integer|min:1',
            'description' => 'sometimes|string',
            'tarif_journalier' => 'sometimes|numeric|min:0',
            'equipements' => 'nullable|array',
            'equipements.*' => 'exists:equipements,id',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:webp,jpg,jpeg,png|max:2048',
        ];
    }



    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Erreur de validation',
            'errors' => $validator->errors()
        ], 422));
    }
}
