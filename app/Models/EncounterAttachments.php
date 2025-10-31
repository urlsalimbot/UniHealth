<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use OwenIt\Auditing\Contracts\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Filesystem\FilesystemAdapter;

class EncounterAttachments extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
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

    protected $auditInclude = [
        'attachment_id',
        'encounter_id',
        'label',
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

    // ✅ Generate public URL
    public function getUrlAttribute()
    {
        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('public');
        return $disk->url($this->file_path);
    }

    // ✅ Get filename (for UI display)
    public function getFilenameAttribute()
    {
        return basename($this->file_path);
    }


    public function medical_encounter(): BelongsTo
    {
        return $this->belongsTo(MedicalEncounters::class, 'encounter_id', 'encounter_id');
    }
}
