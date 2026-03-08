<?php

namespace Tests\Feature;

use App\Models\Espace;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_ne_peut_pas_creer_reservation()
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $espace = Espace::factory()->create();

        $this->actingAs($admin, 'sanctum')
            ->postJson('/api/reservations', [
                'espace_id' => $espace->id,
                'date_debut' => '2025-06-01',
                'date_fin' => '2025-06-03',
            ])
            ->assertStatus(403);
    }

    public function test_utilisateur_peut_creer_reservation()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);
        $espace = Espace::factory()->create(['tarif_journalier' => 100]);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/reservations', [
                'espace_id' => $espace->id,
                'date_debut' => now()->addDays(10)->format('Y-m-d'),
                'date_fin' => now()->addDays(13)->format('Y-m-d'),
            ])
            ->assertStatus(201);
    }
}
