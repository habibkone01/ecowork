<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\Eloquent\Collection;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_role_par_defaut_est_utilisateur()
    {
        $user = User::factory()->create(['role' => 'utilisateur']);
        $this->assertEquals('utilisateur', $user->role);
    }

    public function test_user_peut_etre_admin()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->assertEquals('admin', $admin->role);
    }

    public function test_password_est_cache()
    {
        $user = User::factory()->create();
        $array = $user->toArray();
        $this->assertArrayNotHasKey('password', $array);
    }

    public function test_user_a_les_bons_champs_fillable()
    {
        $fillable = ['nom', 'prenom', 'email', 'password', 'telephone', 'adresse', 'role'];
        $user = new User();
        $this->assertEquals($fillable, $user->getFillable());
    }

    public function test_user_peut_avoir_des_reservations()
    {
        $user = User::factory()->create();
        $this->assertInstanceOf(Collection::class, $user->reservations);
    }
}
