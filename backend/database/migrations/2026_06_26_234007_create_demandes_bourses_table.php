<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demandes_bourses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('etudiant_id')->constrained('etudiants')->cascadeOnDelete();
            $table->foreignId('annee_id')->constrained('annees_academiques')->cascadeOnDelete();
            $table->foreignId('type_bourse_id')->constrained('types_bourses')->cascadeOnDelete();
            $table->date('date_demande');
            $table->decimal('montant_demande', 12, 2)->default(0);
            // Brouillon | Soumise | En vérification | Acceptée | Refusée | Payée
            $table->string('statut')->default('Brouillon');
            $table->text('observation')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demandes_bourses');
    }
};
