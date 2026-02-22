<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Espace extends Model
{
    use HasFactory;

    protected $table = 'espaces';

    protected $fillable = [
        'nom',
        'surface',
        'type',
        'tarif_journalier',
    ];
}
