<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $table = 'reservations';

    protected $fillable = [
        'date_debut',
        'date_fin',
        'prix_total',
        'statut',
        'facture_acquittee',
        'user_id',
        'espace_id',
    ];


}
