<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EncounterAttachments extends Model
{
    use HasFactory;

    protected $table = 'encounter_attachments';
    protected $primaryKey = 'attachment_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'encounter_id',
        'label',
        'file_path',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->attachment_id)) {
                $model->attachment_id = (string) Str::uuid();
            }
        });
    }

    public function medical_encounter(): BelongsTo
    {
        return $this->belongsTo(MedicalEncounters::class, 'encounter_id', 'encounter_id');
    }
}
