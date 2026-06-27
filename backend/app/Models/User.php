<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'photo',
        'adresse',
        'password',
        'actif',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'actif' => 'boolean',
        ];
    }

    /** Nom complet de l'utilisateur. */
    public function getNomCompletAttribute(): string
    {
        return trim("{$this->prenom} {$this->nom}");
    }

    /** Profil étudiant lié (si l'utilisateur est un étudiant). */
    public function etudiant(): HasOne
    {
        return $this->hasOne(Etudiant::class, 'utilisateur_id');
    }

    /** Notifications applicatives de l'utilisateur. */
    public function notificationsApp(): HasMany
    {
        return $this->hasMany(Notification::class, 'utilisateur_id');
    }

    /** Commissions auxquelles l'utilisateur participe. */
    public function commissions(): BelongsToMany
    {
        return $this->belongsToMany(Commission::class, 'commission_membre', 'utilisateur_id', 'commission_id')
            ->withPivot('role_membre')
            ->withTimestamps();
    }
}
