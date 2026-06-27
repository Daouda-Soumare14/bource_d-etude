<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pieces_justificatives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demande_id')->constrained('demandes_bourses')->cascadeOnDelete();
            $table->string('nom_document'); // certificat inscription, relevé de notes, CNI, certificat de résidence
            $table->string('chemin');
            $table->string('statut')->default('En attente'); // En attente | Validée | Rejetée
            $table->text('motif_rejet')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pieces_justificatives');
    }
};
