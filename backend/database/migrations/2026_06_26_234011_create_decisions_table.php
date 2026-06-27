<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('decisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commission_id')->constrained('commissions')->cascadeOnDelete();
            $table->foreignId('demande_id')->unique()->constrained('demandes_bourses')->cascadeOnDelete();
            $table->string('decision'); // Acceptée | Refusée
            $table->text('observation')->nullable();
            $table->decimal('montant_accorde', 12, 2)->default(0);
            $table->date('date_decision');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('decisions');
    }
};
