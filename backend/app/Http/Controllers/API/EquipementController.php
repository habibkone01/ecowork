<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEquipementRequest;
use App\Http\Requests\UpdateEquipementRequest;
use App\Http\Resources\EquipementResource;
use App\Models\Equipement;
use Illuminate\Http\Request;

class EquipementController extends Controller
{
    /**
     * Liste de tous les équipements
     */
    public function index()
    {
        $equipements = Equipement::orderBy('created_at', 'desc')->paginate(10);
        return EquipementResource::collection($equipements);
    }

    /**
     * Créer un équipement (admin uniquement)
     */
    public function store(StoreEquipementRequest $request)
    {
        $equipement = Equipement::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Équipement créé avec succès',
            'equipement' => new EquipementResource($equipement),
        ], 201);
    }

    /**
     * Modifier un équipement (admin uniquement)
     */
    public function update(UpdateEquipementRequest $request, $id)
    {
        $equipement = Equipement::findOrFail($id);
        $equipement->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Équipement mis à jour avec succès',
            'equipement' => new EquipementResource($equipement),
        ], 200);
    }

    /**
     * Supprimer un équipement (admin uniquement)
     * Retiré automatiquement de tous les espaces via cascade
     */
    public function destroy($id)
    {
        $equipement = Equipement::findOrFail($id);
        $equipement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Équipement supprimé avec succès',
        ], 200);
    }
}
