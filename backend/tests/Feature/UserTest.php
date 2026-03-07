<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_peut_voir_liste_des_users()
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->count(3)->create();

        $this->actingAs($admin, 'sanctum')
             ->getJson('/api/users')
             ->assertStatus(200)
             ->assertJsonStructure(['data', 'meta']);
    }

    public function test_utilisateur_ne_peut_pas_voir_liste_des_users()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);

        $this->actingAs($user, 'sanctum')
             ->getJson('/api/users')
             ->assertStatus(403);
    }

    public function test_admin_peut_voir_un_utilisateur()
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $cible = User::factory()->create(['nom' => 'Martin']);

        $this->actingAs($admin, 'sanctum')
             ->getJson('/api/users/' . $cible->id)
             ->assertStatus(200)
             ->assertJsonFragment(['nom' => 'Martin']);
    }

    public function test_utilisateur_peut_voir_son_propre_profil()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);

        $this->actingAs($user, 'sanctum')
             ->getJson('/api/users/' . $user->id)
             ->assertStatus(200);
    }

    public function test_utilisateur_ne_peut_pas_voir_profil_dun_autre()
    {
        /** @var User $user */
        $user      = User::factory()->create(['role' => 'utilisateur']);
        $autreUser = User::factory()->create();

        $this->actingAs($user, 'sanctum')
             ->getJson('/api/users/' . $autreUser->id)
             ->assertStatus(403);
    }

    public function test_utilisateur_peut_modifier_son_profil()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);

        $this->actingAs($user, 'sanctum')
             ->putJson('/api/users/' . $user->id, [
                 'nom'    => 'NouveauNom',
                 'prenom' => $user->prenom,
                 'email'  => $user->email,
             ])
             ->assertStatus(200)
             ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('users', ['id' => $user->id, 'nom' => 'NouveauNom']);
    }

    public function test_utilisateur_ne_peut_pas_changer_son_role()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);

        $this->actingAs($user, 'sanctum')
             ->putJson('/api/users/' . $user->id, [
                 'nom'    => $user->nom,
                 'prenom' => $user->prenom,
                 'email'  => $user->email,
                 'role'   => 'admin',
             ]);

        $this->assertDatabaseHas('users', ['id' => $user->id, 'role' => 'utilisateur']);
    }

    public function test_utilisateur_peut_supprimer_son_compte()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);

        $this->actingAs($user, 'sanctum')
             ->deleteJson('/api/users/' . $user->id)
             ->assertStatus(200)
             ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_utilisateur_ne_peut_pas_supprimer_compte_dun_autre()
    {
        /** @var User $user */
        $user      = User::factory()->create(['role' => 'utilisateur']);
        $autreUser = User::factory()->create();

        $this->actingAs($user, 'sanctum')
             ->deleteJson('/api/users/' . $autreUser->id)
             ->assertStatus(403);

        $this->assertDatabaseHas('users', ['id' => $autreUser->id]);
    }

    public function test_admin_peut_supprimer_nimporte_quel_utilisateur()
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $user  = User::factory()->create();

        $this->actingAs($admin, 'sanctum')
             ->deleteJson('/api/users/' . $user->id)
             ->assertStatus(200);

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
