<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEspaceRequest;
use App\Http\Requests\UpdateEspaceRequest;
use App\Http\Resources\EspaceResource;
use App\Models\Espace;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EspaceController extends Controller
{
    /**
     * Liste des espaces avec filtres
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 9);

        $espaces = Espace::with(['categorie', 'equipements', 'images'])
            ->when($request->categorie_id, function ($query) use ($request) {
                $query->where('categorie_id', $request->categorie_id);
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
     * Créer un espace
     */
    public function store(StoreEspaceRequest $request)
    {
        $espace = Espace::create($request->validated());

        // Associer les équipements
        if ($request->has('equipements')) {
            $espace->equipements()->attach($request->equipements);
        }

        // Uploader et convertir les images en WebP
        if ($request->hasFile('images')) {
            $this->uploadImages($request->file('images'), $espace->id);
        }

        return response()->json([
            'success' => true,
            'message' => 'Espace créé avec succès',
            'espace' => new EspaceResource($espace->load(['categorie', 'equipements', 'images'])),
        ], 201);
    }

    /**
     * Voir un espace avec sa categorie, ses équipements et images
     */
    public function show($id)
    {
        $espace = Espace::with(['categorie', 'equipements', 'images'])->findOrFail($id);
        return new EspaceResource($espace);
    }

    /**
     * Modifier un espace
     */
    public function update(UpdateEspaceRequest $request, $id)
    {
        $espace = Espace::findOrFail($id);
        $espace->update($request->validated());

        if ($request->has('equipements')) {
            $espace->equipements()->sync($request->equipements);
        }

        // Remplacer les images si de nouvelles sont envoyées
        if ($request->hasFile('images')) {
            foreach ($espace->images as $oldImage) {
                Storage::disk('public')->delete($oldImage->url);
                $oldImage->delete();
            }

            $this->uploadImages($request->file('images'), $espace->id);
        }

        return response()->json([
            'success' => true,
            'message' => 'Espace mis à jour avec succès',
            'espace' => new EspaceResource($espace->load(['categorie', 'equipements', 'images'])),
        ], 200);
    }

    /**
     * Supprimer un espace
     */
    public function destroy($id)
    {
        $espace = Espace::findOrFail($id);

        $reservationsActives = $espace->reservations()
            ->where('statut', 'confirmée')
            ->exists();

        if ($reservationsActives) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer cet espace car il a des réservations actives.',
            ], 409);
        }

        $espace->delete();

        return response()->json([
            'success' => true,
            'message' => 'Espace supprimé avec succès',
        ], 200);
    }

    /**
     * Convertir et uploader les images en WebP
     */
    private function uploadImages(array $images, int $espaceId): void
    {
        foreach ($images as $image) {
            $filename = uniqid() . '.webp';
            $path = 'espaces/' . $filename;

            $source = imagecreatefromstring(file_get_contents($image->getRealPath()));
            imagewebp($source, storage_path('app/public/' . $path), 90);
            unset($source);

            Image::create([
                'url' => $path,
                'espace_id' => $espaceId,
            ]);
        }
    }
}
