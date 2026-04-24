<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Espace;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    public function test_utilisateur_voit_seulement_ses_reservations()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);
        $espace = Espace::factory()->create();

        Reservation::factory()->create(['user_id' => $user->id, 'espace_id' => $espace->id]);

        /** @var User $autreUser */
        $autreUser = User::factory()->create();
        Reservation::factory()->create([
            'user_id' => $autreUser->id,
            'espace_id' => $espace->id,
            'date_debut' => '2026-06-01',
            'date_fin' => '2026-06-02',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/reservations');
        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_admin_voit_toutes_les_reservations()
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $espace = Espace::factory()->create();

        /** @var User $user1 */
        $user1 = User::factory()->create();
        /** @var User $user2 */
        $user2 = User::factory()->create();

        Reservation::factory()->create(['user_id' => $user1->id, 'espace_id' => $espace->id]);
        Reservation::factory()->create([
            'user_id' => $user2->id,
            'espace_id' => $espace->id,
            'date_debut' => '2026-06-01',
            'date_fin' => '2026-06-02',
        ]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/reservations');
        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_creer_reservation_calcule_prix_correctement()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);
        $espace = Espace::factory()->create(['tarif_journalier' => 100]);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/reservations', [
                'espace_id' => $espace->id,
                'date_debut' => '2026-06-10',
                'date_fin' => '2026-06-12',
            ])
            ->assertStatus(201)
            ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('reservations', [
            'espace_id' => $espace->id,
            'user_id' => $user->id,
            'prix_total' => 200,
        ]);
    }

    public function test_reservation_sur_espace_deja_occupe_retourne_409()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);
        $espace = Espace::factory()->create();

        Reservation::factory()->create([
            'espace_id' => $espace->id,
            'user_id' => $user->id,
            'date_debut' => '2026-06-10',
            'date_fin' => '2026-06-15',
            'statut' => 'confirmée',
        ]);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/reservations', [
                'espace_id' => $espace->id,
                'date_debut' => '2026-06-12',
                'date_fin' => '2026-06-14',
            ])
            ->assertStatus(409)
            ->assertJsonFragment(['success' => false]);
    }

    public function test_utilisateur_peut_annuler_sa_reservation()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);
        $espace = Espace::factory()->create();

        $reservation = Reservation::factory()->create([
            'user_id' => $user->id,
            'espace_id' => $espace->id,
            'date_debut' => Carbon::now()->addDays(5)->format('Y-m-d'),
            'date_fin' => Carbon::now()->addDays(7)->format('Y-m-d'),
            'statut' => 'confirmée',
        ]);

        $this->actingAs($user, 'sanctum')
            ->patchJson('/api/reservations/' . $reservation->id . '/annuler')
            ->assertStatus(200)
            ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('reservations', ['id' => $reservation->id, 'statut' => 'annulée']);
    }

    public function test_utilisateur_ne_peut_pas_annuler_reservation_dans_moins_de_24h()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);
        $espace = Espace::factory()->create();

        $reservation = Reservation::factory()->create([
            'user_id' => $user->id,
            'espace_id' => $espace->id,
            'date_debut' => Carbon::now()->addHours(12)->format('Y-m-d'),
            'date_fin' => Carbon::now()->addHours(36)->format('Y-m-d'),
            'statut' => 'confirmée',
        ]);

        $this->actingAs($user, 'sanctum')
            ->patchJson('/api/reservations/' . $reservation->id . '/annuler')
            ->assertStatus(403);

        $this->assertDatabaseHas('reservations', ['id' => $reservation->id, 'statut' => 'confirmée']);
    }

    public function test_utilisateur_ne_peut_pas_annuler_reservation_dun_autre()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);
        /** @var User $autreUser */
        $autreUser = User::factory()->create();
        $espace = Espace::factory()->create();

        $reservation = Reservation::factory()->create([
            'user_id' => $autreUser->id,
            'espace_id' => $espace->id,
            'date_debut' => Carbon::now()->addDays(5)->format('Y-m-d'),
            'date_fin' => Carbon::now()->addDays(7)->format('Y-m-d'),
            'statut' => 'confirmée',
        ]);

        $this->actingAs($user, 'sanctum')
            ->patchJson('/api/reservations/' . $reservation->id . '/annuler')
            ->assertStatus(403);
    }

    public function test_admin_peut_annuler_nimporte_quelle_reservation()
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        /** @var User $user */
        $user = User::factory()->create();
        $espace = Espace::factory()->create();

        $reservation = Reservation::factory()->create([
            'user_id' => $user->id,
            'espace_id' => $espace->id,
            'date_debut' => Carbon::now()->addDays(5)->format('Y-m-d'),
            'date_fin' => Carbon::now()->addDays(7)->format('Y-m-d'),
            'statut' => 'confirmée',
        ]);

        $this->actingAs($admin, 'sanctum')
            ->patchJson('/api/reservations/' . $reservation->id . '/annuler')
            ->assertStatus(200)
            ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('reservations', ['id' => $reservation->id, 'statut' => 'annulée']);
    }
}
