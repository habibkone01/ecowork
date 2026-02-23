<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Equipement;

class EquipementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $equipements = [
            'Grande table de réunion',
            'Table individuelle',
            'Vidéo projecteur',
            'Climatisation',
            'Sono et micro',
            'Internet wifi haut débit',
            'Photocopieur',
            'Machine à café',
        ];

        foreach ($equipements as $equipement) {
            Equipement::create(['nom' => $equipement]);
        }
    }
}
