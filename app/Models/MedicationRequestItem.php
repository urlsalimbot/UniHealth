<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MedicationRequestItem extends Model
{
    protected $fillable = ['medication_request_id', 'medication_id', 'quantity'];

    public function medication()
    {
        return $this->belongsTo(Medications::class);
    }
}
