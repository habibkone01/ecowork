<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Espace;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Liste des réservations
     * Admin : toutes les réservations avec filtres sur dates et statut
     * Utilisateur : uniquement ses propres réservations
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);

        if ($request->user()->role === 'admin') {
            $reservations = Reservation::with(['user', 'espace'])
                ->when($request->statut, function ($query) use ($request) {
                    $query->where('statut', $request->statut);
                })
                ->when($request->date_debut, function ($query) use ($request) {
                    $query->where('date_debut', '>=', $request->date_debut);
                })
                ->when($request->date_fin, function ($query) use ($request) {
                    $query->where('date_fin', '<=', $request->date_fin);
                })
                ->paginate($perPage);
        } else {
            $reservations = Reservation::with(['espace'])
                ->where('user_id', $request->user()->id)
                ->paginate($perPage);
        }

        return ReservationResource::collection($reservations);
    }

    /**
     * Créer une réservation
     * Admin et utilisateur réservent pour eux mêmes
     */
    public function store(StoreReservationRequest $request)
    {
        // Vérifier la disponibilité de l'espace aux dates choisies
        $disponible = !Reservation::where('espace_id', $request->espace_id)
            ->where('statut', 'confirmée')
            ->where(function ($query) use ($request) {
                $query->whereBetween('date_debut', [$request->date_debut, $request->date_fin])
                    ->orWhereBetween('date_fin', [$request->date_debut, $request->date_fin])
                    ->orWhere(function ($query) use ($request) {
                        $query->where('date_debut', '<=', $request->date_debut)
                            ->where('date_fin', '>=', $request->date_fin);
                    });
            })
            ->exists();

        if (!$disponible) {
            return response()->json([
                'success' => false,
                'message' => 'Cet espace n\'est pas disponible aux dates choisies, veuillez choisir d\'autres dates',
            ], 409);
        }

        // Calculer le prix total automatiquement
        $espace = Espace::findOrFail($request->espace_id);
        $dateDebut = Carbon::parse($request->date_debut);
        $dateFin = Carbon::parse($request->date_fin);
        $jours = $dateDebut->diffInDays($dateFin) + 1;
        $prixTotal = $espace->tarif_journalier * $jours;

        // Créer la réservation
        $reservation = Reservation::create([
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'prix_total' => $prixTotal,
            'statut' => 'confirmée',
            'facture_acquittee' => false,
            'user_id' => $request->user()->id,
            'espace_id' => $request->espace_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Réservation confirmée avec succès',
            'reservation' => new ReservationResource($reservation->load(['user', 'espace'])),
        ], 201);
    }

    /**
     * Voir une réservation
     * Admin : peut voir n'importe quelle réservation
     * Utilisateur : peut voir uniquement ses propres réservations
     */
    public function show(Request $request, $id)
    {
        $reservation = Reservation::with(['user', 'espace'])->findOrFail($id);

        if ($request->user()->role !== 'admin' && $reservation->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        return new ReservationResource($reservation);
    }

    /**
     * Modifier une réservation (admin uniquement)
     * Cas exceptionnels : changer les dates, l'espace, marquer la facture acquittée
     */
    public function update(UpdateReservationRequest $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Réservation mise à jour avec succès',
            'reservation' => new ReservationResource($reservation->load(['user', 'espace'])),
        ], 200);
    }

    /**
     * Annuler une réservation
     * Admin : peut annuler sans restriction
     * Utilisateur : peut annuler uniquement ses réservations et seulement 24h avant
     */
    public function destroy(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);

        // Vérifier que l'utilisateur annule bien sa propre réservation
        if ($request->user()->role !== 'admin' && $reservation->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        // Vérifier la règle des 24h pour les utilisateurs
        if ($request->user()->role !== 'admin') {
            $heuresAvant = Carbon::now()->diffInHours(Carbon::parse($reservation->date_debut), false);
            if ($heuresAvant < 24) {
                return response()->json([
                    'success' => false,
                    'message' => 'Annulation impossible, la réservation commence dans moins de 24h',
                ], 403);
            }
        }

        $reservation->update(['statut' => 'annulée']);

        return response()->json([
            'success' => true,
            'message' => 'Réservation annulée avec succès',
        ], 200);
    }
}
