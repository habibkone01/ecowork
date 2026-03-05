<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEspaceRequest;
use App\Http\Requests\UpdateEspaceRequest;
use App\Http\Resources\EspaceResource;
use App\Models\Espace;
use App\Models\Image;
use Illuminate\Http\Request;

class EspaceController extends Controller
{
    /**
     * Liste des espaces avec filtres
     * Filtre par type, équipement, dates de disponibilité
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 9);

        $espaces = Espace::with(['equipements', 'images'])
            ->when($request->type, function ($query) use ($request) {
                $query->where('type', $request->type);
            })
            ->when($request->equipement_id, function ($query) use ($request) {
                $query->whereHas('equipements', function ($query) use ($request) {
                    $query->where('equipements.id', $request->equipement_id);
                });
            })
            ->when($request->date_debut && $request->date_fin, function ($query) use ($request) {
                $query->whereDoesntHave('reservations', function ($query) use ($request) {
                    $query->where('statut', 'confirmée')
                        ->where(function ($query) use ($request) {
                            $query->whereBetween('date_debut', [$request->date_debut, $request->date_fin])
                                ->orWhereBetween('date_fin', [$request->date_debut, $request->date_fin])
                                ->orWhere(function ($query) use ($request) {
                                    $query->where('date_debut', '<=', $request->date_debut)
                                        ->where('date_fin', '>=', $request->date_fin);
                                });
                        });
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return EspaceResource::collection($espaces);
    }

    /**
     * Créer un espace (admin uniquement)
     * Images converties automatiquement en WebP
     */
    public function store(StoreEspaceRequest $request)
    {
        $espace = Espace::create($request->only(['nom', 'surface', 'type', 'capacite', 'description', 'tarif_journalier']));

        // Associer les équipements
        if ($request->has('equipements')) {
            $espace->equipements()->attach($request->equipements);
        }

        // Uploader et convertir les images en WebP
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $filename = uniqid() . '.webp';
                $path = 'espaces/' . $filename;

                // Conversion native PHP en WebP
                $source = imagecreatefromstring(file_get_contents($image->getRealPath()));
                imagewebp($source, storage_path('app/public/' . $path), 90);
                unset($source);

                Image::create([
                    'url' => $path,
                    'espace_id' => $espace->id,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Espace créé avec succès',
            'espace' => new EspaceResource($espace->load(['equipements', 'images'])),
        ], 201);
    }

    /**
     * Voir un espace avec ses équipements et images
     */
    public function show($id)
    {
        $espace = Espace::with(['equipements', 'images'])->findOrFail($id);
        return new EspaceResource($espace);
    }

    /**
     * Modifier un espace (admin uniquement)
     * Sync des équipements et ajout de nouvelles images
     */
    public function update(UpdateEspaceRequest $request, $id)
    {
        $espace = Espace::findOrFail($id);
        $espace->update($request->only(['nom', 'surface', 'type', 'capacite', 'description', 'tarif_journalier']));

        // Mettre à jour les équipements
        if ($request->has('equipements')) {
            $espace->equipements()->sync($request->equipements);
        }

        // Ajouter de nouvelles images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $filename = uniqid() . '.webp';
                $path = 'espaces/' . $filename;

                // Conversion native PHP en WebP
                $source = imagecreatefromstring(file_get_contents($image->getRealPath()));
                imagewebp($source, storage_path('app/public/' . $path), 90);
                unset($source);

                Image::create([
                    'url' => $path,
                    'espace_id' => $espace->id,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Espace mis à jour avec succès',
            'espace' => new EspaceResource($espace->load(['equipements', 'images'])),
        ], 200);
    }

    /**
     * Supprimer un espace (admin uniquement)
     * Supprime aussi les images et réservations associées via cascade
     */
    public function destroy($id)
    {
        $espace = Espace::findOrFail($id);
        $espace->delete();

        return response()->json([
            'success' => true,
            'message' => 'Espace supprimé avec succès',
        ], 200);
    }
}
