<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateReservationRequest extends FormRequest
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
            'date_debut' => 'sometimes|date|after_or_equal:today',
            'date_fin' => 'sometimes|date|after:date_debut',
            'espace_id' => 'sometimes|exists:espaces,id',
            'statut' => 'sometimes|in:confirmée,annulée',
            'facture_acquittee' => 'sometimes|boolean',
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
