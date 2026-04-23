<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Liste des utilisateurs
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);

        $users = User::when($request->search, function ($query) use ($request) {
            $query->where('nom', 'like', '%' . $request->search . '%')
                ->orWhere('prenom', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%');
        })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return UserResource::collection($users);
    }

    /**
     * Créer un utilisateur
     */
    public function store(StoreUserRequest $request)
    {
        $user = User::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur créé avec succès',
            'user' => new UserResource($user),
        ], 201);
    }

    /**
     * Voir un utilisateur
     */
    public function show(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($request->user()->role !== 'admin' && $request->user()->id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        return new UserResource($user);
    }

    /**
     * Modifier un utilisateur
     */
    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::findOrFail($id);

        if ($request->user()->role !== 'admin' && $request->user()->id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        $user->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur mis à jour avec succès',
            'user' => new UserResource($user),
        ], 200);
    }

    /**
     * Supprimer un utilisateur
     */
    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($request->user()->role !== 'admin' && $request->user()->id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        $reservationsActives = $user->reservations()
            ->where('statut', 'confirmée')
            ->exists();

        if ($reservationsActives) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer cet utilisateur car il a des réservations actives.',
            ], 409);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès',
        ], 200);
    }
}
