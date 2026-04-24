<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Espace;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    public function definition(): array
    {
        $dateDebut = fake()->dateTimeBetween('now', '+1 month');
        $dateFin = fake()->dateTimeBetween($dateDebut, '+2 months');
        $espace = Espace::inRandomOrder()->first();
        $jours = $dateDebut->diff($dateFin)->days + 1;

        return [
            'date_debut' => $dateDebut,
            'date_fin' => $dateFin,
            'prix_total' => $espace->tarif_journalier * $jours,
            'statut' => fake()->randomElement(['confirmée', 'annulée']),
            'facture_acquittee' => fake()->boolean(),
            'user_id' => User::factory(),
            'espace_id' => $espace->id,
        ];
    }
}
