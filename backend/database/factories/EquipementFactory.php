<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Equipement>
 */
class EquipementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom' => $this->faker->randomElement([
                'Projecteur', 'Climatisation', 'Wifi', 'Machine à café',
                'Photocopieur', 'Sono', 'Grande table', 'Tableau blanc'
            ]),
        ];
    }
}
