<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use OwenIt\Auditing\Contracts\Auditable;
class PatientInvitation extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use HasFactory;

    protected $fillable = ['token', 'created_by', 'expires_at', 'used_at'];
    protected $auditInclude = ['token', 'created_by', 'expires_at', 'used_at'];

    protected $dates = ['expires_at', 'used_at'];

    public static function generate($userId)
    {
        return self::create([
            'token' => Str::uuid(),
            'created_by' => $userId,
            'expires_at' => now()->addDays(3), // expires in 3 days
        ]);
    }


    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
    ];

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isUsed(): bool
    {
        return !is_null($this->used_at);
    }
}