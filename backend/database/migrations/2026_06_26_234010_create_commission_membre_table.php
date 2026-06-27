<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commission_membre', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commission_id')->constrained('commissions')->cascadeOnDelete();
            $table->foreignId('utilisateur_id')->constrained('users')->cascadeOnDelete();
            $table->string('role_membre')->nullable(); // président, membre, rapporteur
            $table->timestamps();
            $table->unique(['commission_id', 'utilisateur_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commission_membre');
    }
};
