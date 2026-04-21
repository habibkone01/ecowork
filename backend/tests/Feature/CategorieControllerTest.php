<?php

namespace Tests\Feature;

use App\Models\Categorie;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategorieControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_peut_lister_categories()
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        Categorie::factory()->count(3)->create();

        $this->actingAs($admin, 'sanctum')
             ->getJson('/api/categories')
             ->assertStatus(200)
             ->assertJsonStructure(['data', 'meta']);
    }

    public function test_utilisateur_peut_lister_categories()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);
        Categorie::factory()->count(3)->create();

        $this->actingAs($user, 'sanctum')
             ->getJson('/api/categories')
             ->assertStatus(200)
             ->assertJsonStructure(['data', 'meta']);
    }

    public function test_sans_token_liste_categories_retourne_401()
    {
        $this->getJson('/api/categories')
             ->assertStatus(401);
    }

    public function test_admin_peut_creer_categorie()
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin, 'sanctum')
             ->postJson('/api/categories', ['libelle' => 'bureau'])
             ->assertStatus(201)
             ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('categories', ['libelle' => 'bureau']);
    }

    public function test_utilisateur_ne_peut_pas_creer_categorie()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);

        $this->actingAs($user, 'sanctum')
             ->postJson('/api/categories', ['libelle' => 'bureau'])
             ->assertStatus(403);
    }

    public function test_creation_categorie_avec_libelle_deja_existant_retourne_422()
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        Categorie::factory()->create(['libelle' => 'bureau']);

        $this->actingAs($admin, 'sanctum')
             ->postJson('/api/categories', ['libelle' => 'bureau'])
             ->assertStatus(422)
             ->assertJsonFragment(['success' => false]);
    }

    public function test_admin_peut_modifier_categorie()
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $categorie = Categorie::factory()->create(['libelle' => 'Ancien libelle']);

        $this->actingAs($admin, 'sanctum')
             ->putJson("/api/categories/{$categorie->id}", ['libelle' => 'Nouveau libelle'])
             ->assertStatus(200)
             ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('categories', ['libelle' => 'Nouveau libelle']);
    }

    public function test_utilisateur_ne_peut_pas_modifier_categorie()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);
        $categorie = Categorie::factory()->create();

        $this->actingAs($user, 'sanctum')
             ->putJson("/api/categories/{$categorie->id}", ['libelle' => 'Nouveau libelle'])
             ->assertStatus(403);
    }

    public function test_admin_peut_supprimer_categorie()
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $categorie = Categorie::factory()->create();

        $this->actingAs($admin, 'sanctum')
             ->deleteJson("/api/categories/{$categorie->id}")
             ->assertStatus(200)
             ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseMissing('categories', ['id' => $categorie->id]);
    }

    public function test_utilisateur_ne_peut_pas_supprimer_categorie()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);
        $categorie = Categorie::factory()->create();

        $this->actingAs($user, 'sanctum')
             ->deleteJson("/api/categories/{$categorie->id}")
             ->assertStatus(403);
    }
}
