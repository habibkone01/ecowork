<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_cree_un_compte_avec_succes()
    {
        $response = $this->postJson('/api/register', [
            'nom'                  => 'Dupont',
            'prenom'               => 'Jean',
            'email'                => 'jean@test.com',
            'password'             => 'password123',
            'password_confirmation'=> 'password123',
            'role'                 => 'utilisateur',
            'telephone'            => '0612345678',
            'adresse'              => '12 rue de Paris',
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['success' => true])
                 ->assertJsonStructure(['token', 'user']);

        $this->assertDatabaseHas('users', ['email' => 'jean@test.com']);
    }

    public function test_register_echoue_si_email_deja_utilise()
    {
        User::factory()->create(['email' => 'jean@test.com']);

        $response = $this->postJson('/api/register', [
            'nom'                  => 'Dupont',
            'prenom'               => 'Jean',
            'email'                => 'jean@test.com',
            'password'             => 'password123',
            'password_confirmation'=> 'password123',
            'telephone'            => '0612345678',
            'adresse'              => '12 rue de Paris',
        ]);

        $response->assertStatus(422);
    }

    public function test_login_avec_bons_credentials_retourne_token()
    {
        User::factory()->create([
            'email'    => 'jean@test.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'jean@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['success' => true])
                 ->assertJsonStructure(['token', 'user']);
    }

    public function test_login_avec_mauvais_password_retourne_401()
    {
        User::factory()->create([
            'email'    => 'jean@test.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'jean@test.com',
            'password' => 'mauvaispassword',
        ]);

        $response->assertStatus(401)
                 ->assertJsonFragment(['success' => false]);
    }

    public function test_logout_invalide_le_token()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
             ->postJson('/api/logout')
             ->assertStatus(200)
             ->assertJsonFragment(['success' => true]);
    }

    public function test_logout_sans_token_retourne_401()
    {
        $this->postJson('/api/logout')->assertStatus(401);
    }
}
