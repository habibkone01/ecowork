<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;

class UserTest extends TestCase
{
    public function test_role_par_defaut_est_utilisateur()
    {
        $user = new User();
        $this->assertEquals('utilisateur', $user->role);
    }

    public function test_user_peut_etre_admin()
    {
        $user = new User(['role' => 'admin']);
        $this->assertEquals('admin', $user->role);
    }

    public function test_password_est_cache()
    {
        $user = new User();
        $this->assertContains('password', $user->getHidden());
    }

    public function test_user_a_les_bons_champs_fillable()
    {
        $fillable = ['nom', 'prenom', 'email', 'password', 'telephone', 'adresse', 'role'];
        $user = new User();
        $this->assertEquals($fillable, $user->getFillable());
    }

    public function test_user_a_une_relation_reservations()
    {
        $user = new User();
        $this->assertTrue(method_exists($user, 'reservations'));
    }
}
