<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    /**
     * Supprimer une image
     */
    public function destroy($id)
    {
        $image = Image::findOrFail($id);

        Storage::disk('public')->delete($image->url);

        $image->delete();

        return response()->json([
            'success' => true,
            'message' => 'Image supprimée avec succès',
        ], 200);
    }
}
