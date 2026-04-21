<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategorieRequest;
use App\Http\Requests\UpdateCategorieRequest;
use App\Http\Resources\CategorieResource;
use App\Models\Categorie;

class CategorieController extends Controller
{
    /**
     * Liste de toutes les catégories
     */
    public function index()
    {
        $categories = Categorie::orderBy('created_at', 'desc')->paginate(10);

        return CategorieResource::collection($categories);
    }

    /**
     * Créer une catégorie
     */
    public function store(StoreCategorieRequest $request)
    {
        $categorie = Categorie::create($request->validated());

        return response()->json([
            'success'   => true,
            'message'   => 'Catégorie créée avec succès',
            'categorie' => new CategorieResource($categorie),
        ], 201);
    }

    /**
     * Modifier une catégorie
     */
    public function update(UpdateCategorieRequest $request, $id)
    {
        $categorie = Categorie::findOrFail($id);
        $categorie->update($request->validated());

        return response()->json([
            'success'   => true,
            'message'   => 'Catégorie mise à jour avec succès',
            'categorie' => new CategorieResource($categorie),
        ], 200);
    }

    /**
     * Supprimer une catégorie
     */
    public function destroy($id)
    {
        $categorie = Categorie::findOrFail($id);
        $categorie->delete();

        return response()->json([
            'success' => true,
            'message' => 'Catégorie supprimée avec succès',
        ], 200);
    }
}
