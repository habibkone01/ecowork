<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Espace;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EspaceTest extends TestCase
{
    use RefreshDatabase;

    public function test_espace_a_les_bons_champs_fillable()
    {
        $fillable = ['nom', 'surface', 'type', 'capacite', 'description', 'tarif_journalier'];
        $espace = new Espace();
        $this->assertEquals($fillable, $espace->getFillable());
    }

    public function test_espace_peut_etre_cree_avec_tous_les_champs()
    {
        $espace = Espace::factory()->create([
            'nom'              => 'Bureau Zen',
            'surface'          => 30,
            'type'             => 'bureau',
            'capacite'         => 5,
            'description'      => 'Un beau bureau',
            'tarif_journalier' => 120,
        ]);

        $this->assertEquals('Bureau Zen', $espace->nom);
        $this->assertEquals(30, $espace->surface);
        $this->assertEquals('bureau', $espace->type);
        $this->assertEquals(5, $espace->capacite);
        $this->assertEquals(120, $espace->tarif_journalier);
    }

    public function test_espace_a_relation_reservations()
    {
        $espace = Espace::factory()->create();
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $espace->reservations);
    }

    public function test_espace_a_relation_equipements()
    {
        $espace = Espace::factory()->create();
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $espace->equipements);
    }

    public function test_espace_a_relation_images()
    {
        $espace = Espace::factory()->create();
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $espace->images);
    }

    public function test_tarif_journalier_est_numerique()
    {
        $espace = Espace::factory()->create(['tarif_journalier' => 150.50]);
        $this->assertIsNumeric($espace->tarif_journalier);
    }
}
