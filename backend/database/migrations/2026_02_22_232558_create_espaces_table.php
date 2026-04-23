<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('espaces', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->float('surface');
            $table->integer('capacite');
            $table->text('description')->nullable();
            $table->decimal('tarif_journalier', 8, 2);
            $table->foreignId('categorie_id')->constrained('categories')->onDelete('restrict');
            $table->timestamps();
            $table->softDeletes();
            $table->index('categorie_id');
            $table->index('tarif_journalier');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('espaces');
    }
};
