<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reclamations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('etudiant_id')->constrained('etudiants')->cascadeOnDelete();
            $table->foreignId('demande_id')->nullable()->constrained('demandes_bourses')->nullOnDelete();
            $table->string('objet');
            $table->text('description');
            $table->string('document')->nullable(); // pièce jointe
            $table->string('statut')->default('Ouverte'); // Ouverte | En cours | Traitée | Fermée
            $table->text('reponse')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reclamations');
    }
};
