<?php

namespace Tests\Feature;

use App\Models\Espace;
use App\Models\Image;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ImageControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_peut_supprimer_image()
    {
        Storage::fake('public');

        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $espace = Espace::factory()->create();
        $image = Image::factory()->create([
            'espace_id' => $espace->id,
            'url' => 'images/test.jpg',
        ]);

        $this->actingAs($admin, 'sanctum')
             ->deleteJson("/api/images/{$image->id}")
             ->assertStatus(200)
             ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseMissing('images', ['id' => $image->id]);
    }

    public function test_utilisateur_ne_peut_pas_supprimer_image()
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => 'utilisateur']);
        $espace = Espace::factory()->create();
        $image = Image::factory()->create(['espace_id' => $espace->id]);

        $this->actingAs($user, 'sanctum')
             ->deleteJson("/api/images/{$image->id}")
             ->assertStatus(403);
    }

    public function test_sans_token_suppression_image_retourne_401()
    {
        $espace = Espace::factory()->create();
        $image = Image::factory()->create(['espace_id' => $espace->id]);

        $this->deleteJson("/api/images/{$image->id}")
             ->assertStatus(401);
    }
}
