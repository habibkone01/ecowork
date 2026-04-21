<?php

namespace Database\Factories;

use App\Models\Categorie;
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
            'capacite' => fake()->numberBetween(2, 50),
            'description' => fake()->paragraph(),
            'tarif_journalier' => fake()->randomFloat(2, 50, 500),
            'categorie_id' => Categorie::inRandomOrder()->first()?->id
                ?? Categorie::factory()->create()->id,
        ];
    }
}
