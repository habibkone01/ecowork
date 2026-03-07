<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Liste des utilisateurs (admin uniquement)
     * Recherche par nom, prénom ou email
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
     * Créer un utilisateur (admin uniquement)
     * L'admin peut créer un compte avec un rôle spécifique
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
     * Admin : peut voir n'importe quel utilisateur
     * Utilisateur : peut voir uniquement son propre profil
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
     * Admin : peut modifier n'importe quel utilisateur y compris le rôle
     * Utilisateur : peut modifier uniquement son propre profil sans changer son rôle
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

        $data = $request->validated();

        // Seul l'admin peut modifier le rôle
        if ($request->user()->role !== 'admin') {
            unset($data['role']);
        }

        // Hasher le mot de passe si modifié
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur mis à jour avec succès',
            'user' => new UserResource($user),
        ], 200);
    }

    /**
     * Supprimer un utilisateur
     * Admin : peut supprimer n'importe quel utilisateur
     * Utilisateur : peut supprimer uniquement son propre compte
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

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès',
        ], 200);
    }
}
