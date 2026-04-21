<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Categorie;

class CategorieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['libelle' => 'bureau'],
            ['libelle' => 'salle de réunion'],
            ['libelle' => 'conférence'],
        ];

        foreach ($categories as $categorie) {
            Categorie::firstOrCreate(['libelle' => $categorie['libelle']]);
        }
    }
}
