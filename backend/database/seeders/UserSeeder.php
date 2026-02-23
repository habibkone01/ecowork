<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Création du premier admin
        User::create([
            'nom' => 'Admin',
            'prenom' => 'ecowork',
            'email' => 'admin@ecowork.fr',
            'password' => Hash::make('admin@12'),
            'telephone' => '0600000000',
            'adresse' => '11ème arrondissement, Paris',
            'role' => 'admin',
        ]);
    }
}
