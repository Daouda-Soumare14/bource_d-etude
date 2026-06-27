<?php

namespace Database\Factories;

use App\Models\DemandeBourse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DemandeBourse>
 */
class DemandeBourseFactory extends Factory
{
    protected $model = DemandeBourse::class;

    public function definition(): array
    {
        return [
            'date_demande' => $this->faker->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'montant_demande' => $this->faker->randomElement([180000, 360000, 540000, 720000]),
            'statut' => DemandeBourse::STATUT_SOUMISE,
            'observation' => null,
        ];
    }
}
