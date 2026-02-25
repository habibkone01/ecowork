<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EspaceController;
use App\Http\Controllers\Api\EquipementController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Routes publiques (sans connexion)
Route::post('/register', [AuthController::class, 'register'])->name('api.auth.register');
Route::post('/login', [AuthController::class, 'login'])->name('api.auth.login');

// Routes protégées (connexion obligatoire)
Route::middleware('auth:sanctum')->group(function () {

    // Déconnexion
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.auth.logout');

    // Profil de l'utilisateur connecté
    Route::get('/me', function (Request $request) {
        return $request->user();
    })->name('api.me');

    // Espaces (tout le monde connecté peut voir)
    Route::get('/espaces', [EspaceController::class, 'index'])->name('api.espaces.index');
    Route::get('/espaces/{id}', [EspaceController::class, 'show'])->name('api.espaces.show');

    // Equipements (tout le monde connecté peut voir)
    Route::get('/equipements', [EquipementController::class, 'index'])->name('api.equipements.index');

    // Réservations (utilisateur et admin)
    Route::get('/reservations', [ReservationController::class, 'index'])->name('api.reservations.index');
    Route::post('/reservations', [ReservationController::class, 'store'])->name('api.reservations.store');
    Route::get('/reservations/{id}', [ReservationController::class, 'show'])->name('api.reservations.show');
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy'])->name('api.reservations.destroy');

    // Profil utilisateur (l'utilisateur peut modifier et supprimer son propre compte)
    Route::get('/users/{id}', [UserController::class, 'show'])->name('api.users.show');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('api.users.update');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('api.users.destroy');

    // Routes admin uniquement
    Route::middleware('admin')->group(function () {

        // Gestion des espaces
        Route::post('/espaces', [EspaceController::class, 'store'])->name('api.espaces.store');
        Route::put('/espaces/{id}', [EspaceController::class, 'update'])->name('api.espaces.update');
        Route::delete('/espaces/{id}', [EspaceController::class, 'destroy'])->name('api.espaces.destroy');

        // Gestion des images
        Route::delete('/images/{id}', [ImageController::class, 'destroy'])->name('api.images.destroy');

        // Gestion des équipements
        Route::post('/equipements', [EquipementController::class, 'store'])->name('api.equipements.store');
        Route::put('/equipements/{id}', [EquipementController::class, 'update'])->name('api.equipements.update');
        Route::delete('/equipements/{id}', [EquipementController::class, 'destroy'])->name('api.equipements.destroy');

        // Gestion des réservations
        Route::put('/reservations/{id}', [ReservationController::class, 'update'])->name('api.reservations.update');

        // Gestion des utilisateurs
        Route::get('/users', [UserController::class, 'index'])->name('api.users.index');
        Route::post('/users', [UserController::class, 'store'])->name('api.users.store');
    });
});
