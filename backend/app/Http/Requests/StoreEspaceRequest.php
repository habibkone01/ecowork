<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreEspaceRequest extends FormRequest
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
            'nom'              => 'required|string|max:255',
            'surface'          => 'required|numeric|min:1',
            'categorie_id'     => 'required|exists:categories,id',
            'capacite'         => 'required|integer|min:1',
            'description'      => 'required|string',
            'tarif_journalier' => 'required|numeric|min:0',
            'equipements'      => 'nullable|array',
            'equipements.*'    => 'exists:equipements,id',
            'images'           => 'nullable|array',
            'images.*'         => 'image|mimes:webp,jpg,jpeg,png|max:2048',
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
            'errors'  => $validator->errors()
        ], 422));
    }
}
