<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('types_bourses', function (Blueprint $table) {
            $table->id();
            $table->string('nom'); // Bourse entière, Demi-bourse, Aide sociale, Bourse d'excellence
            $table->decimal('montant', 12, 2)->default(0);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('types_bourses');
    }
};
