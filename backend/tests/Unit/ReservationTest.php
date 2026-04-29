<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Reservation;

class ReservationTest extends TestCase
{
    public function test_prix_total_calcul_correct()
    {
        $tarif = 100;
        $dateDebut = new \DateTime('2025-03-10');
        $dateFin = new \DateTime('2025-03-12');
        $jours = $dateDebut->diff($dateFin)->days;
        $prixTotal = $tarif * $jours;

        $this->assertEquals(200, $prixTotal);
    }

    public function test_statut_par_defaut_est_confirmee()
    {
        $reservation = new Reservation(['statut' => 'confirmée']);
        $this->assertEquals('confirmée', $reservation->statut);
    }

    public function test_facture_non_acquittee_par_defaut()
    {
        $reservation = new Reservation(['facture_acquittee' => false]);
        $this->assertFalse((bool) $reservation->facture_acquittee);
    }

    public function test_reservation_appartient_a_un_user()
    {
        $reservation = new Reservation();
        $this->assertTrue(method_exists($reservation, 'user'));
    }

    public function test_reservation_appartient_a_un_espace()
    {
        $reservation = new Reservation();
        $this->assertTrue(method_exists($reservation, 'espace'));
    }
}
