<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Espace;

class EspaceTest extends TestCase
{
    public function test_espace_a_les_bons_champs_fillable()
    {
        $fillable = ['nom', 'surface', 'capacite', 'description', 'tarif_journalier', 'categorie_id'];
        $espace = new Espace();
        $this->assertEquals($fillable, $espace->getFillable());
    }

    public function test_espace_peut_etre_cree_avec_tous_les_champs()
    {
        $espace = new Espace([
            'nom' => 'Bureau Zen',
            'surface' => 30,
            'categorie_id' => 1,
            'capacite' => 5,
            'description' => 'Un beau bureau',
            'tarif_journalier' => 120,
        ]);

        $this->assertEquals('Bureau Zen', $espace->nom);
        $this->assertEquals(30, $espace->surface);
        $this->assertEquals(1, $espace->categorie_id);
        $this->assertEquals(5, $espace->capacite);
        $this->assertEquals(120, $espace->tarif_journalier);
    }

    public function test_espace_a_relation_reservations()
    {
        $espace = new Espace();
        $this->assertTrue(method_exists($espace, 'reservations'));
    }

    public function test_espace_a_relation_equipements()
    {
        $espace = new Espace();
        $this->assertTrue(method_exists($espace, 'equipements'));
    }

    public function test_espace_a_relation_images()
    {
        $espace = new Espace();
        $this->assertTrue(method_exists($espace, 'images'));
    }

    public function test_tarif_journalier_est_numerique()
    {
        $espace = new Espace(['tarif_journalier' => 150.50]);
        $this->assertIsNumeric($espace->tarif_journalier);
    }
}
