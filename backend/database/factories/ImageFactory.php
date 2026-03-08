<?php

namespace Database\Factories;

use App\Models\Espace;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Image>
 */
class ImageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'url' => 'images/' . $this->faker->uuid() . '.jpg',
            'espace_id' => Espace::factory(),
        ];
    }
}
