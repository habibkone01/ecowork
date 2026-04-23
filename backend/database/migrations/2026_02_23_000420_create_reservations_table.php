<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->date('date_debut');
            $table->date('date_fin');
            $table->decimal('prix_total', 8, 2);
            $table->enum('statut', ['confirmée', 'annulée', 'terminée'])->default('confirmée');
            $table->boolean('facture_acquittee')->default(false);
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('espace_id')->constrained('espaces')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
            $table->index('statut');
            $table->index('date_debut');
            $table->index('date_fin');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
