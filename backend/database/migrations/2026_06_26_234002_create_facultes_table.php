<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facultes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('universite_id')->constrained('universites')->cascadeOnDelete();
            $table->string('nom');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facultes');
    }
};
