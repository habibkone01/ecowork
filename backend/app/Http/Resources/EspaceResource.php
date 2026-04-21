<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EspaceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'surface' => $this->surface,
            'capacite' => $this->capacite,
            'description' => $this->description,
            'tarif_journalier' => $this->tarif_journalier,
            'categorie' => new CategorieResource($this->whenLoaded('categorie')),
            'equipements' => EquipementResource::collection($this->whenLoaded('equipements')),
            'images' => ImageResource::collection($this->whenLoaded('images')),
            'created_at' => $this->created_at->format('d-m-Y H:i'),
            'updated_at' => $this->updated_at->format('d-m-Y H:i'),
        ];
    }
}
