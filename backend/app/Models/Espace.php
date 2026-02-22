<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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

      public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function equipements()
    {
        return $this->belongsToMany(Equipement::class, 'espace_equipement');
    }

    public function images()
    {
        return $this->hasMany(Image::class);
    }

    
}
