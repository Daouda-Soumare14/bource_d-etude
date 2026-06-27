<?php

namespace Database\Factories;

use App\Models\Etudiant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Etudiant>
 */
class EtudiantFactory extends Factory
{
    protected $model = Etudiant::class;

    public function definition(): array
    {
        $regions = ['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Diourbel', 'Kaolack', 'Louga', 'Fatick', 'Kolda', 'Tambacounda'];

        return [
            'utilisateur_id' => User::factory(),
            'matricule' => 'ETU' . now()->format('Y') . $this->faker->unique()->numerify('#####'),
            'date_naissance' => $this->faker->dateTimeBetween('-28 years', '-18 years')->format('Y-m-d'),
            'sexe' => $this->faker->randomElement(['M', 'F']),
            'region' => $this->faker->randomElement($regions),
            'niveau' => $this->faker->randomElement(['L1', 'L2', 'L3', 'M1', 'M2']),
        ];
    }
}
