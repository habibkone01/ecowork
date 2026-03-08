<?php

namespace Tests\Feature;

use App\Models\Equipement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EquipementControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_peut_lister_equipements()
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        Equipement::factory()->count(3)->create();

        $this->actingAs($admin, 'sanctum')
             ->getJson('/api/equipements')
             ->assertStatus(200)
             ->assertJsonStructure(['data', 'meta']);
    }

    public function test_sans_token_liste_equipements_retourne_401()
    {
        $this->getJson('/api/equipements')
             ->assertStatus(401);
    }

    public function test_admin_peut_creer_equipement()
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin, 'sanctum')
             ->postJson('/api/equipements', ['nom' => 'Projecteur'])
             ->assertStatus(201)
             ->assertJsonFragment(['success' => true]);
    }

    public function test_utilisateur_ne_peut_pas_creer_equipement()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);

        $this->actingAs($user, 'sanctum')
             ->postJson('/api/equipements', ['nom' => 'Projecteur'])
             ->assertStatus(403);
    }

    public function test_admin_peut_modifier_equipement()
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $equipement = Equipement::factory()->create(['nom' => 'Ancien nom']);

        $this->actingAs($admin, 'sanctum')
             ->putJson("/api/equipements/{$equipement->id}", ['nom' => 'Nouveau nom'])
             ->assertStatus(200)
             ->assertJsonFragment(['success' => true]);
    }

    public function test_admin_peut_supprimer_equipement()
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $equipement = Equipement::factory()->create();

        $this->actingAs($admin, 'sanctum')
             ->deleteJson("/api/equipements/{$equipement->id}")
             ->assertStatus(200)
             ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseMissing('equipements', ['id' => $equipement->id]);
    }

    public function test_utilisateur_ne_peut_pas_supprimer_equipement()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);
        $equipement = Equipement::factory()->create();

        $this->actingAs($user, 'sanctum')
             ->deleteJson("/api/equipements/{$equipement->id}")
             ->assertStatus(403);
    }
}
