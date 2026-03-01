<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Espace>
 */
class EspaceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
       return [
            'nom' => fake()->company(),
            'surface' => fake()->randomFloat(1, 10, 200),
            'type' => fake()->randomElement(['bureau', 'salle de réunion', 'conférence']),
            'capacite' => fake()->numberBetween(2, 50),
            'description' => fake()->paragraph(),
            'tarif_journalier' => fake()->randomFloat(2, 50, 500),
        ];
    }
}
