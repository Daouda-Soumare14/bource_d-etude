<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Faculte extends Model
{
    use HasFactory;

    protected $table = 'facultes';

    protected $fillable = ['universite_id', 'nom'];

    public function universite(): BelongsTo
    {
        return $this->belongsTo(Universite::class);
    }

    public function filieres(): HasMany
    {
        return $this->hasMany(Filiere::class);
    }
}
