<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date_debut' => $this->date_debut,
            'date_fin' => $this->date_fin,
            'prix_total' => $this->prix_total,
            'statut' => $this->statut,
            'facture_acquittee' => $this->facture_acquittee,
            'user' => new UserResource($this->whenLoaded('user')),
            'espace' => new EspaceResource($this->whenLoaded('espace')),
            'created_at' => $this->created_at->format('d-m-Y H:i'),
            'updated_at' => $this->updated_at->format('d-m-Y H:i'),
        ];
    }
}
