<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('espace_equipement', function (Blueprint $table) {
            $table->foreignId('espace_id')->constrained('espaces')->onDelete('cascade');
            $table->foreignId('equipement_id')->constrained('equipements')->onDelete('cascade');
            $table->primary(['espace_id', 'equipement_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('espace_equipement');
    }
};
