<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('decision_id')->constrained('decisions')->cascadeOnDelete();
            $table->decimal('montant', 12, 2);
            $table->date('date_paiement');
            $table->string('mode_paiement')->nullable(); // virement, mobile money, chèque, espèces
            $table->string('reference')->nullable();
            $table->string('statut')->default('en attente'); // payé | en attente | annulé
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
