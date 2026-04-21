<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Espace;
use App\Models\Reservation;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            EquipementSeeder::class,
            CategorieSeeder::class, // Doit être avant EspaceFactory
        ]);

        User::factory(10)->create();
        Espace::factory(5)->create();
        Reservation::factory(20)->create();

        $espaces = \App\Models\Espace::all();
        $equipements = \App\Models\Equipement::all();

        $espaces->each(function ($espace) use ($equipements) {
            $espace->equipements()->attach(
                $equipements->random(rand(2, 5))->pluck('id')->toArray()
            );
        });
    }
}
