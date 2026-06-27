<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TypeBourse extends Model
{
    use HasFactory;

    protected $table = 'types_bourses';

    protected $fillable = ['nom', 'montant', 'description'];

    protected $casts = [
        'montant' => 'decimal:2',
    ];

    public function demandes(): HasMany
    {
        return $this->hasMany(DemandeBourse::class, 'type_bourse_id');
    }
}
