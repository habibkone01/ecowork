<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Espace;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EspaceTest extends TestCase
{
    use RefreshDatabase;

    public function test_liste_espaces_retourne_pagination()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);
        Espace::factory()->count(5)->create();

        $this->actingAs($user, 'sanctum')
             ->getJson('/api/espaces')
             ->assertStatus(200)
             ->assertJsonStructure(['data', 'meta']);
    }

    public function test_liste_espaces_sans_token_retourne_401()
    {
        $this->getJson('/api/espaces')->assertStatus(401);
    }

    public function test_filtre_par_type_fonctionne()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);
        Espace::factory()->create(['type' => 'bureau']);
        Espace::factory()->create(['type' => 'salle de réunion']);

        $response = $this->actingAs($user, 'sanctum')
                         ->getJson('/api/espaces?type=bureau');

        $response->assertStatus(200);
        foreach ($response->json('data') as $espace) {
            $this->assertEquals('bureau', $espace['type']);
        }
    }

    public function test_voir_un_espace_retourne_detail()
    {
        /** @var User $user */
        $user   = User::factory()->create(['role' => 'utilisateur']);
        $espace = Espace::factory()->create(['nom' => 'Bureau Zen']);

        $this->actingAs($user, 'sanctum')
             ->getJson('/api/espaces/' . $espace->id)
             ->assertStatus(200)
             ->assertJsonFragment(['nom' => 'Bureau Zen']);
    }

    public function test_voir_espace_inexistant_retourne_404()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);

        $this->actingAs($user, 'sanctum')
             ->getJson('/api/espaces/9999')
             ->assertStatus(404);
    }

    public function test_admin_peut_creer_un_espace()
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin, 'sanctum')
             ->postJson('/api/espaces', [
                 'nom'              => 'Nouveau Bureau',
                 'surface'          => 25,
                 'type'             => 'bureau',
                 'capacite'         => 4,
                 'description'      => 'Un beau bureau',
                 'tarif_journalier' => 100,
             ])
             ->assertStatus(201)
             ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('espaces', ['nom' => 'Nouveau Bureau']);
    }

    public function test_utilisateur_ne_peut_pas_creer_un_espace()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);

        $this->actingAs($user, 'sanctum')
             ->postJson('/api/espaces', [
                 'nom'              => 'Bureau Pirate',
                 'surface'          => 20,
                 'type'             => 'bureau',
                 'capacite'         => 2,
                 'description'      => 'Test',
                 'tarif_journalier' => 50,
             ])
             ->assertStatus(403);
    }

    public function test_admin_peut_modifier_un_espace()
    {
        /** @var User $admin */
        $admin  = User::factory()->create(['role' => 'admin']);
        $espace = Espace::factory()->create(['nom' => 'Ancien Nom']);

        $this->actingAs($admin, 'sanctum')
             ->putJson('/api/espaces/' . $espace->id, [
                 'nom'              => 'Nouveau Nom',
                 'surface'          => $espace->surface,
                 'type'             => $espace->type,
                 'capacite'         => $espace->capacite,
                 'description'      => $espace->description,
                 'tarif_journalier' => $espace->tarif_journalier,
             ])
             ->assertStatus(200)
             ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('espaces', ['nom' => 'Nouveau Nom']);
    }

    public function test_admin_peut_supprimer_un_espace()
    {
        /** @var User $admin */
        $admin  = User::factory()->create(['role' => 'admin']);
        $espace = Espace::factory()->create();

        $this->actingAs($admin, 'sanctum')
             ->deleteJson('/api/espaces/' . $espace->id)
             ->assertStatus(200)
             ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseMissing('espaces', ['id' => $espace->id]);
    }

    public function test_utilisateur_ne_peut_pas_supprimer_un_espace()
    {
        /** @var User $user */
        $user   = User::factory()->create(['role' => 'utilisateur']);
        $espace = Espace::factory()->create();

        $this->actingAs($user, 'sanctum')
             ->deleteJson('/api/espaces/' . $espace->id)
             ->assertStatus(403);

        $this->assertDatabaseHas('espaces', ['id' => $espace->id]);
    }
}
