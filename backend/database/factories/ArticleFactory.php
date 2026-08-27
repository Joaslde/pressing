<?php

namespace Database\Factories;

use App\Models\Article;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Article> */
class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
            'description' => fake()->sentence(),
            'price' => fake()->randomElement([1000, 1500, 2000, 2500]),
            'is_active' => true,
        ];
    }
}
