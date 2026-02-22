<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipement extends Model
{
    use HasFactory;

    protected $table = 'equipements';

    protected $fillable = [
        'nom',
    ];


    public function espaces()
    {
        return $this->belongsToMany(Espace::class, 'espace_equipement');
    }

}
