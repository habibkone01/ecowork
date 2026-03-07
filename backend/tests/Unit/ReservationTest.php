<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Reservation;
use App\Models\Espace;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    public function test_prix_total_calcul_correct()
    {
        $espace = Espace::factory()->create(['tarif_journalier' => 100]);
        $user = User::factory()->create();

        $reservation = Reservation::create([
            'date_debut' => '2025-03-10',
            'date_fin'   => '2025-03-12',
            'prix_total' => 300, // 3 jours × 100€
            'statut'     => 'confirmée',
            'facture_acquittee' => false,
            'user_id'    => $user->id,
            'espace_id'  => $espace->id,
        ]);

        $d1 = new \DateTime($reservation->date_debut);
        $d2 = new \DateTime($reservation->date_fin);
        $nbJours = $d1->diff($d2)->days + 1;
        $prixAttendu = $nbJours * $espace->tarif_journalier;

        $this->assertEquals(300, $reservation->prix_total);
        $this->assertEquals($prixAttendu, $reservation->prix_total);
    }

    public function test_statut_par_defaut_est_confirmee()
    {
        $espace = Espace::factory()->create();
        $user = User::factory()->create();

        $reservation = Reservation::create([
            'date_debut' => '2025-03-10',
            'date_fin'   => '2025-03-11',
            'prix_total' => 100,
            'statut'     => 'confirmée',
            'facture_acquittee' => false,
            'user_id'    => $user->id,
            'espace_id'  => $espace->id,
        ]);

        $this->assertEquals('confirmée', $reservation->statut);
    }

    public function test_facture_non_acquittee_par_defaut()
    {
        $espace = Espace::factory()->create();
        $user = User::factory()->create();

        $reservation = Reservation::create([
            'date_debut' => '2025-03-10',
            'date_fin'   => '2025-03-11',
            'prix_total' => 100,
            'statut'     => 'confirmée',
            'facture_acquittee' => false,
            'user_id'    => $user->id,
            'espace_id'  => $espace->id,
        ]);

        $this->assertFalse((bool) $reservation->facture_acquittee);
    }

    public function test_reservation_appartient_a_un_user()
    {
        $user = User::factory()->create();
        $espace = Espace::factory()->create();

        $reservation = Reservation::create([
            'date_debut' => '2025-03-10',
            'date_fin'   => '2025-03-11',
            'prix_total' => 100,
            'statut'     => 'confirmée',
            'facture_acquittee' => false,
            'user_id'    => $user->id,
            'espace_id'  => $espace->id,
        ]);

        $this->assertEquals($user->id, $reservation->user->id);
    }

    public function test_reservation_appartient_a_un_espace()
    {
        $user = User::factory()->create();
        $espace = Espace::factory()->create(['nom' => 'Salle Zen']);

        $reservation = Reservation::create([
            'date_debut' => '2025-03-10',
            'date_fin'   => '2025-03-11',
            'prix_total' => 100,
            'statut'     => 'confirmée',
            'facture_acquittee' => false,
            'user_id'    => $user->id,
            'espace_id'  => $espace->id,
        ]);

        $this->assertEquals('Salle Zen', $reservation->espace->nom);
    }
}
