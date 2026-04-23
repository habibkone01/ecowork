<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Espace extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'espaces';

    protected $fillable = [
        'nom',
        'surface',
        'capacite',
        'description',
        'tarif_journalier',
        'categorie_id',
    ];

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

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
